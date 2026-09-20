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

  // 2. قراءة النص الخام للطلب (Raw Text) كما أرسله Clerk تماماً
  let body: string;
  try {
    body = await req.text();
  } catch (err) {
    console.error('❌ فشل قراءة محتوى الطلب النصي:', err);
    return new Response('فشل قراءة محتوى الطلب', { status: 400 });
  }

  // 3. التحقق من توقيع Svix واستخراج الكائن
  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })  as unknown as WebhookEvent;
  } catch (err) {
    console.error('❌ فشل التحقق من توقيع Svix:', err);
    return new Response('فشل التحقق من التوقيع', { status: 400 });
  }

  // 4. فحص الأمان لضمان وجود الكائن ونوع الحدث
  if (!evt || !evt.type) {
    console.log('⚠️ وصل طلب بدون type أو كائن غير ممتلئ');
    return new Response('تم استلام الطلب بدون نوع حدث', { status: 200 });
  }

  const eventType = evt.type;
  console.log(`ℹ️ نوع الحدث المستلم بوضوح: ${eventType}`);

  // 5. معالجة أحداث إنشاء أو تحديث المستخدم
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

    if (!primaryEmail) {
      console.error('❌ البريد الإلكتروني مفقود من بيانات المستخدم');
      return new Response('البريد الإلكتروني مفقود', { status: 400 });
    }

    try {
      console.log(`⏳ جاري محاولة الحفظ في Neon للمستخدم ID: ${id}...`);

      await db
        .insert(users)
        .values({
          clerkId: id,
          name: fullName,
          email: primaryEmail,
          imageUrl: image_url,
        })
        .onConflictDoUpdate({
          target: users.clerkId,
          set: {
            name: fullName,
            email: primaryEmail,
            imageUrl: image_url,
          },
        });

      console.log(`✅ تم الحفظ بنجاح في Neon للمستخدم: ${fullName} (${id})`);
      return new Response('تم حفظ المستخدم بنجاح', { status: 200 });
    } catch (dbError) {
      console.error('❌ خطأ أثناء الحفظ في قاعدة البيانات Neon:', dbError);
      return new Response('خطأ في قاعدة البيانات', { status: 500 });
    }
  }

  console.log(`⚠️ تم تجاهل الحدث (${eventType}) لأنه ليس user.created أو user.updated`);
  return new Response(`تم استلام الحدث وتجاهله: ${eventType}`, { status: 200 });
}