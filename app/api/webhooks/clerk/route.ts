import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db'; 
import { users } from '@/db/schema'; 

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET غير موجود في متغيرات البيئة!');
    return new Response('خطأ في إعدادات السيرفر', { status: 500 });
  }

  // 1. جلب الهيدرز الخاصة بـ Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ هيدرز Svix مفقودة من الطلب');
    return new Response('طلب غير مكتمل', { status: 400 });
  }

  // 2. قراءة النص الخام للطلب
  let body: string;
  try {
    body = await req.text();
  } catch (err) {
    console.error('❌ فشل قراءة محتوى الطلب النصي:', err);
    return new Response('فشل قراءة محتوى الطلب', { status: 400 });
  }

  // 3. التحقق من توقيع Svix
  const wh = new Webhook(SIGNING_SECRET);
  let rawEvt: any;

  try {
    rawEvt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('❌ فشل التحقق من توقيع Svix:', err);
    return new Response('فشل التحقق من التوقيع', { status: 400 });
  }

  // 4. ضمان تحويل النتيجة إلى كائن JSON مقروء
  let evt: WebhookEvent;
  try {
    evt = typeof rawEvt === 'string' ? JSON.parse(rawEvt) : rawEvt;
  } catch (e) {
    console.error('❌ فشل تحليل كائن JSON:', e);
    return new Response('محتوى الطلب غير صالح', { status: 400 });
  }

  // استخراج نوع الحدث بالتحقق من كافة التركيبات المحتملة
  const eventType = evt?.type || (evt as any)?.event_type;

  if (!eventType) {
    console.log('⚠️ وصل طلب بدون type. محتوى البيانات المفككة:', JSON.stringify(evt));
    return new Response('تم استلام الطلب بدون نوع حدث', { status: 200 });
  }

  console.log(`ℹ️ نوع الحدث المستلم بوضوح: ${eventType}`);

  // 5. معالجة أحداث إنشاء أو تحديث المستخدم
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, primary_email_address_id, image_url } = evt.data as any;

    const primaryEmailObj = email_addresses?.find(
      (email: any) => email.id === primary_email_address_id
    ) || email_addresses?.[0];

    const primaryEmail = primaryEmailObj?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

    if (!primaryEmail) {
      console.error('❌ البريد الإلكتروني مفقود من بيانات المستخدم');
      return new Response('البريد الإلكتروني مفقود', { status: 400 });
    }

    try {
      console.log(`⏳ جاري محاولة الحفظ في Neon للمستخدم: ${fullName} (${id})...`);

      await db
        .insert(users)
        .values({
          clerkId: id as any,
          name: fullName,
          email: primaryEmail,
          imageUrl: image_url || null,
        })
        .onConflictDoUpdate({
          target: users.clerkId,
          set: {
            name: fullName,
            email: primaryEmail,
            imageUrl: image_url || null,
          },
        });

      console.log(`✅ تم الحفظ بنجاح في Neon للمستخدم: ${fullName} (${id})`);
      return new Response('تم حفظ المستخدم بنجاح', { status: 200 });
    } catch (dbError: any) {
      console.error('❌ تفاصيل خطأ Neon DB:', {
        message: dbError?.message,
        detail: dbError?.detail,
        code: dbError?.code,
      });
      return new Response(`خطأ في قاعدة البيانات: ${dbError?.message}`, { status: 500 });
    }
  }

  console.log(`⚠️ تم تجاهل الحدث (${eventType}) لأنه ليس user.created أو user.updated`);
  return new Response(`تم استلام الحدث وتجاهله: ${eventType}`, { status: 200 });
}