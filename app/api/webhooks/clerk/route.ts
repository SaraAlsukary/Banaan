// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { WebhookEvent } from '@clerk/nextjs/server';
// import { db } from '@/db'; 
// import { users } from '@/db/schema'; 

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

//   if (!SIGNING_SECRET) {
//     console.error('❌ CLERK_WEBHOOK_SECRET غير موجود في متغيرات البيئة!');
//     return new Response('خطأ في إعدادات السيرفر', { status: 500 });
//   }

//   // 1. قراءة الهيدرز من Svix
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get('svix-id');
//   const svix_timestamp = headerPayload.get('svix-timestamp');
//   const svix_signature = headerPayload.get('svix-signature');

//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     console.error('❌ هيدرز Svix مفقودة من الطلب');
//     return new Response('طلب غير مكتمل', { status: 400 });
//   }

//   // 2. قراءة النص الخام للطلب
//   const body = await req.text();

//   // 3. التحقق من توقيع Svix
//   const wh = new Webhook(SIGNING_SECRET);

//   try {
//     wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     });
//   } catch (err) {
//     console.error('❌ فشل التحقق من توقيع Svix:', err);
//     return new Response('فشل التحقق من التوقيع', { status: 400 });
//   }

//   // 4. تحويل النص الخام إلى JSON بضمان تام
//   let evt: WebhookEvent;
//   try {
//     evt = JSON.parse(body) as WebhookEvent;
//   } catch (err) {
//     console.error('❌ فشل تحويل نص البيانات إلى JSON:', err);
//     return new Response('بيانات غير صالحة', { status: 400 });
//   }

//   // 5. قراءة نوع الحدث
//   const eventType = evt.type;
//   console.log(`ℹ️ نوع الحدث المستلم بنجاح: ${eventType}`);

//   // 6. معالجة أحداث إنشاء أو تحديث المستخدم
//   if (eventType === 'user.created' || eventType === 'user.updated') {
//     const { id, first_name, last_name, email_addresses, primary_email_address_id, image_url } = evt.data;

//     // استخراج البريد الأساسي
//     const primaryEmailObj = email_addresses?.find(
//       (email: any) => email.id === primary_email_address_id
//     ) || email_addresses?.[0];

//     const primaryEmail = primaryEmailObj?.email_address;
//     const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

//     if (!primaryEmail) {
//       console.error('❌ البريد الإلكتروني مفقود من بيانات Clerk');
//       return new Response('البريد الإلكتروني مفقود', { status: 400 });
//     }

//     try {
//       console.log(`⏳ جاري حفظ البيانات في Neon للمستخدم: ${fullName} (${id})...`);

//       await db
//         .insert(users)
//         .values({
//           clerkId: id,
//           name: fullName,
//           email: primaryEmail,
//           imageUrl: image_url || null,
//         })
//         .onConflictDoUpdate({
//           target: users.clerkId,
//           set: {
//             name: fullName,
//             email: primaryEmail,
//             imageUrl: image_url || null,
//           },
//         });

//       console.log(`✅ تم الحفظ بنجاح في Neon للمستخدم: ${fullName} (${id})`);
//       return new Response('تم حفظ المستخدم بنجاح', { status: 200 });
//     } catch (dbError: any) {
//       console.error('❌ تفاصيل خطأ Neon DB:', {
//         message: dbError?.message,
//         detail: dbError?.detail,
//         code: dbError?.code,
//       });
//       return new Response(`خطأ في قاعدة البيانات: ${dbError?.message}`, { status: 500 });
//     }
//   }

//   return new Response(`تم استلام الحدث وتجاهله: ${eventType}`, { status: 200 });
// }


import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db'; 
import { users } from '@/db/schema'; 
import { eq } from 'drizzle-orm'; // تم إضافة eq لاستخدامها في التحديث والحذف

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET غير موجود في متغيرات البيئة!');
    return new Response('خطأ في إعدادات السيرفر', { status: 500 });
  }

  // 1. قراءة الهيدرز من Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ هيدرز Svix مفقودة من الطلب');
    return new Response('طلب غير مكتمل', { status: 400 });
  }

  // 2. قراءة النص الخام للطلب
  const body = await req.text();

  // 3. التحقق من توقيع Svix
  const wh = new Webhook(SIGNING_SECRET);

  try {
    wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('❌ فشل التحقق من توقيع Svix:', err);
    return new Response('فشل التحقق من التوقيع', { status: 400 });
  }

  // 4. تحويل النص الخام إلى JSON
  let evt: WebhookEvent;
  try {
    evt = JSON.parse(body) as WebhookEvent;
  } catch (err) {
    console.error('❌ فشل تحويل نص البيانات إلى JSON:', err);
    return new Response('بيانات غير صالحة', { status: 400 });
  }

  // 5. قراءة نوع الحدث
  const eventType = evt.type;
  console.log(`ℹ️ نوع الحدث المستلم بنجاح: ${eventType}`);

  try {
    // -------------------------------------------------------------
    // 1. Create (إنشاء مستخدم جديد): user.created
    // -------------------------------------------------------------
    if (eventType === 'user.created') {
      const { id, first_name, last_name, email_addresses, primary_email_address_id, image_url } = evt.data;

      const primaryEmailObj = email_addresses?.find(
        (email: any) => email.id === primary_email_address_id
      ) || email_addresses?.[0];

      const primaryEmail = primaryEmailObj?.email_address;
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

      if (!primaryEmail) {
        console.error('❌ البريد الإلكتروني مفقود من بيانات Clerk');
        return new Response('البريد الإلكتروني مفقود', { status: 400 });
      }

      console.log(`⏳ جاري إنشاء مستخدم جديد في Neon: ${fullName} (${id})...`);

      await db
        .insert(users)
        .values({
          clerkId: id,
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

      console.log(`✅ تم إنشاء المستخدم بنجاح: ${fullName} (${id})`);
      return new Response('تم إنشاء المستخدم بنجاح', { status: 201 });
    }

    // -------------------------------------------------------------
    // 2. Update (تحديث بيانات مستخدم): user.updated
    // -------------------------------------------------------------
    if (eventType === 'user.updated') {
      const { id, first_name, last_name, email_addresses, primary_email_address_id, image_url } = evt.data;

      const primaryEmailObj = email_addresses?.find(
        (email: any) => email.id === primary_email_address_id
      ) || email_addresses?.[0];

      const primaryEmail = primaryEmailObj?.email_address;
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'مستخدم';

      console.log(`⏳ جاري تحديث بيانات المستخدم في Neon: (${id})...`);

      await db
        .update(users)
        .set({
          name: fullName,
          ...(primaryEmail && { email: primaryEmail }),
          imageUrl: image_url || null,
        })
        .where(eq(users.clerkId, id));

      console.log(`✅ تم تحديث البيانات بنجاح للمستخدم: (${id})`);
      return new Response('تم تحديث البيانات بنجاح', { status: 200 });
    }

    // -------------------------------------------------------------
    // 3. Delete (حذف مستخدم): user.deleted
    // -------------------------------------------------------------
    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      if (!id) {
        console.error('❌ معرف المستخدم (clerkId) مفقود في حدث الحذف');
        return new Response('معرف المستخدم مفقود', { status: 400 });
      }

      console.log(`⏳ جاري حذف المستخدم من Neon: (${id})...`);

      await db.delete(users).where(eq(users.clerkId, id));

      console.log(`✅ تم حذف المستخدم بنجاح من Neon: (${id})`);
      return new Response('تم حذف المستخدم بنجاح', { status: 200 });
    }

  } catch (dbError: any) {
    console.error('❌ تفاصيل خطأ Neon DB:', {
      message: dbError?.message,
      detail: dbError?.detail,
      code: dbError?.code,
    });
    return new Response(`خطأ في قاعدة البيانات: ${dbError?.message}`, { status: 500 });
  }

  return new Response(`تم استلام الحدث وتجاهله: ${eventType}`, { status: 200 });
}