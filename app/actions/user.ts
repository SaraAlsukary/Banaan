"use server";

import { currentUser, createClerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateAvatarAction(formData: FormData): Promise<string> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("غير مصرح بالوصول");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("لم يتم اختيار أي ملف");
  }

  // 1️⃣ رفع الصورة إلى التخزين السحابي (مثال باستخدام Vercel Blob)
  /* 
  import { put } from "@vercel/blob";
  const blob = await put(`avatars/${clerkUser.id}-${file.name}`, file, {
    access: "public",
  });
  const uploadedImageUrl = blob.url;
  */

  // أو تحديث صورة البروفايل مباشرة عبر Clerk API (اختياري)
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  await clerkClient.users.updateUserProfileImage(clerkUser.id, { file });
  
  const updatedUser = await clerkClient.users.getUser(clerkUser.id);
  const uploadedImageUrl = updatedUser.imageUrl;

  // 2️⃣ تحديث رابط الصورة في قاعدة البيانات عبر Drizzle
  await db
    .update(users)
    .set({ imageUrl: uploadedImageUrl })
    .where(eq(users.clerkId, clerkUser.id));

  // 3️⃣ إعادة تنشيط المسار لتحديث الكاش
  revalidatePath("/profile");

  return uploadedImageUrl;
}


import { auth } from "@clerk/nextjs/server";

export async function deleteAccountServerAction() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("المستخدم غير مسجل الدخول");
  }

  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  // 1. حذف بيانات المستخدم من Clerk من جانب السيرفر مباشرة
  await clerk.users.deleteUser(userId);

  revalidatePath("/");
  return { success: true };
}