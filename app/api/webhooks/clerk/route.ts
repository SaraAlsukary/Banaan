import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db'; 
import { users } from '@/db/schema'; 
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('يرجى إضافة CLERK_WEBHOOK_SECRET في ملف .env.local');
  }

  // جلب الهيدرز الخاصة بـ Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('خطأ: هيدرز Svix مفقودة', { status: 400 });
  }

  // ⚠️ قراءة نص الطلب الخام المباشر (Raw Text) لضمان عدم تغير التوقيع
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
    console.error('خطأ في التحقق من توقيع Svix:', err);
    return new Response('خطأ في التحقق من التوقيع', { status: 400 });
  }

  const eventType = evt.type;

  // 1. إنشاء أو تحديث حساب مستخدم عند التسجيل أو التعديل
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

    if (primaryEmail) {
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
    }
  }

  // 2. حذف المستخدم من قاعدة البيانات عند حذفه من Clerk
  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
      await db.delete(users).where(eq(users.clerkId, id));
    }
  }

  return new Response('تمت عملية المزامنة بنجاح', { status: 200 });
}