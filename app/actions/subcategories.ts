"use server";
import { db } from "@/db";
import { subcategories, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob"; // استبدال fs بـ Vercel Blob

export async function getSubcategories() {
    const data = await db.select({
        id: subcategories.id,
        name: subcategories.name,
        imageUrl: subcategories.imageUrl,
        createdAt: subcategories.createdAt,
        categoryId: subcategories.categoryId,
        categoryName: categories.name,
    })
    .from(subcategories)
    .leftJoin(categories, eq(subcategories.categoryId, categories.id))
    .orderBy(subcategories.createdAt);

    return data.map((subcat) => ({
        ...subcat,
        createdAt: subcat.createdAt ? new Date(subcat.createdAt).toISOString().split('T')[0] : "بدون تاريخ",
    }));
}

export async function saveSubcategory(formData: FormData, id?: number) {
    try {
        const name = formData.get("name") as string;
        const categoryId = parseInt(formData.get("categoryId") as string);
        const imageFile = formData.get("image") as File | null;
        
        let imageUrl = null;

        if (imageFile && imageFile.size > 0) {
            const safeFileName = `subcategories/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
            const blob = await put(safeFileName, imageFile, {
                access: "public",
            });
            imageUrl = blob.url;
        }

        if (id) {
            await db.update(subcategories)
              .set({ 
                  name, 
                  categoryId, 
                  ...(imageUrl && { imageUrl }) 
              })
              .where(eq(subcategories.id, id));
        } else {
            await db.insert(subcategories).values({ name, categoryId, imageUrl });
        }

        revalidatePath("/subcategories");
        return { success: true };
    } catch (error) {
        console.error("Error saving subcategory:", error);
        return { success: false, error: "حدث خطأ أثناء حفظ التصنيف الفرعي" };
    }
}

export async function deleteSubcategory(id: number) {
    try {
        await db.delete(subcategories).where(eq(subcategories.id, id));
        revalidatePath("/subcategories");
        return { success: true };
    } catch (error) {
        return { success: false, error: "حدث خطأ أثناء الحذف" };
    }
}