"use server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// استيراد المكتبات اللازمة لحفظ الملفات فعلياً في مجلدات المشروع
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function getCategories() {
  const data = await db.select().from(categories).orderBy(categories.createdAt);
  
  return data.map((cat) => ({
    ...cat,
    createdAt: cat.createdAt ? new Date(cat.createdAt).toISOString().split('T')[0] : "بدون تاريخ",
  }));
}

export async function saveCategory(formData: FormData, id?: number) {
    try {
        const name = formData.get("name") as string;
        const imageFile = formData.get("image") as File | null;
        
        let imageUrl = null;

        // إذا قام المستخدم باختيار صورة فعلاً
        if (imageFile && imageFile.size > 0) {
            // 1. تحويل الصورة إلى صيغة يمكن للسيرفر قراءتها (Buffer)
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 2. تنظيف اسم الصورة من المسافات وإضافة تاريخ لضمان عدم تكرار الاسم
            const safeFileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;

            // 3. تحديد مسار مجلد الحفظ (public/uploads)
            const uploadDir = path.join(process.cwd(), "public/uploads");

            // 4. إنشاء المجلد تلقائياً إذا لم يكن موجوداً
            await mkdir(uploadDir, { recursive: true });

            // 5. تحديد المسار النهائي للملف وحفظه فعلياً على الهارد ديسك
            const filePath = path.join(uploadDir, safeFileName);
            await writeFile(filePath, buffer);
            
            // 6. هذا هو الرابط الذي سيتم حفظه في الداتا بيز وقراءته في الموقع
            imageUrl = `/uploads/${safeFileName}`; 
        }

        if (id) {
            // تحديث (Update)
            await db.update(categories)
              .set({ name, ...(imageUrl && { imageUrl }) })
              .where(eq(categories.id, id));
        } else {
            // إضافة جديدة (Create)
            await db.insert(categories).values({ name, imageUrl });
        }

        revalidatePath("/categories");
        return { success: true };
    } catch (error) {
        console.error("Error saving category:", error);
        return { success: false, error: "حدث خطأ أثناء الحفظ" };
    }
}

export async function deleteCategory(id: number) {
    try {
        await db.delete(categories).where(eq(categories.id, id));
        revalidatePath("/categories");
        return { success: true };
    } catch (error) {
        return { success: false, error: "لا يمكن حذف تصنيف يحتوي على بيانات فرعية" };
    }
}