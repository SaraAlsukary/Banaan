"use server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob"; // استبدال fs بـ Vercel Blob

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

        if (imageFile && imageFile.size > 0) {
            const safeFileName = `categories/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
            const blob = await put(safeFileName, imageFile, {
                access: "public",
            });
            imageUrl = blob.url;
        }

        if (id) {
            await db.update(categories)
              .set({ name, ...(imageUrl && { imageUrl }) })
              .where(eq(categories.id, id));
        } else {
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