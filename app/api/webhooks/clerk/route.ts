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

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ هيدرز Svix مفقودة من الطلب');
    return new Response('طلب غير مكتمل', { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })as unknown as WebhookEvent;
  } catch (err) {
    console.error('❌ فشل التحقق من توقيع Svix:', err);
    return new Response('فشل التحقق من التوقيع', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

    if (!primaryEmail) {
      console.error('❌ لا يوجد بريد إلكتروني في بيانات المستخدم');
      return new Response('البريد الإلكتروني مفقود', { status: 400 });
    }

    try {
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

      console.log(`✅ تم حفظ/تحديث المستخدم بنجاح: ${id}`);
    } catch (dbError) {
      console.error('❌ خطأ أثناء الحفظ في Neon:', dbError);
      return new Response('خطأ في قاعدة البيانات', { status: 500 });
    }
  }

  return new Response('تمت العملية بنجاح', { status: 200 });
}