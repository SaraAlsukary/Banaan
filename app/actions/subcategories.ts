"use server";
import { db } from "@/db";
import { subcategories, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// استيراد المكتبات اللازمة لحفظ الملفات
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// 1. جلب التصنيفات الفرعية مع اسم التصنيف الأساسي التابع لها
export async function getSubcategories() {
    const data = await db.select({
        id: subcategories.id,
        name: subcategories.name,
        imageUrl: subcategories.imageUrl,
        createdAt: subcategories.createdAt,
        categoryId: subcategories.categoryId,
        categoryName: categories.name, // جلب اسم التصنيف الأساسي
    })
    .from(subcategories)
    .leftJoin(categories, eq(subcategories.categoryId, categories.id))
    .orderBy(subcategories.createdAt);

    // تحويل التاريخ إلى نص لتجنب مشاكل React
    return data.map((subcat) => ({
        ...subcat,
        createdAt: subcat.createdAt ? new Date(subcat.createdAt).toISOString().split('T')[0] : "بدون تاريخ",
    }));
}

// 2. إضافة أو تعديل تصنيف فرعي
export async function saveSubcategory(formData: FormData, id?: number) {
    try {
        const name = formData.get("name") as string;
        const categoryId = parseInt(formData.get("categoryId") as string);
        const imageFile = formData.get("image") as File | null;
        
        let imageUrl = null;

        // منطق حفظ الصورة الفعلي
        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const safeFileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
            const uploadDir = path.join(process.cwd(), "public/uploads");

            await mkdir(uploadDir, { recursive: true });

            const filePath = path.join(uploadDir, safeFileName);
            await writeFile(filePath, buffer);
            
            imageUrl = `/uploads/${safeFileName}`; 
        }

        if (id) {
            // [منطق التعديل]
            await db.update(subcategories)
              .set({ 
                  name, 
                  categoryId, 
                  ...(imageUrl && { imageUrl }) // لا تقم بتحديث الصورة إذا لم يرفع صورة جديدة
              })
              .where(eq(subcategories.id, id));
        } else {
            // [منطق الإضافة]
            await db.insert(subcategories).values({ name, categoryId, imageUrl });
        }

        revalidatePath("/subcategories"); // تحديث مسار الصفحة
        return { success: true };
    } catch (error) {
        console.error("Error saving subcategory:", error);
        return { success: false, error: "حدث خطأ أثناء حفظ التصنيف الفرعي" };
    }
}

// 3. حذف التصنيف الفرعي
export async function deleteSubcategory(id: number) {
    try {
        await db.delete(subcategories).where(eq(subcategories.id, id));
        revalidatePath("/subcategories");
        return { success: true };
    } catch (error) {
        return { success: false, error: "حدث خطأ أثناء الحذف" };
    }
}