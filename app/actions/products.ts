"use server";
import { db } from "@/db";
import { 
    products, 
    productImages, 
    productSubcategories, 
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob"; // استبدال fs بـ Vercel Blob

// ==========================================
// دالة مساعدة لرفع الصور إلى Vercel Blob
// ==========================================
async function uploadFile(file: File): Promise<string> {
    const safeFileName = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const blob = await put(safeFileName, file, {
        access: "public",
    });
    return blob.url; // إرجاع رابط الصورة السحابي Direct URL
}

// ==========================================
// 1. جلب جميع المنتجات
// ==========================================
// ==========================================
// 1. جلب جميع المنتجات مع كافة بيانات التصنيفات الفرعية
// ==========================================
export async function getProducts() {
    const data = await db.query.products.findMany({
        with: {
            subcategories: {
                with: {
                    subcategory: true
                }
            },
            images: true
        },
        orderBy: (products, { desc }) => [desc(products.createdAt)]
    });

    return data.map((product) => ({
        id: product.id,
        name: product.name,
        shortDescription: product.shortDescription,
        price: product.price,
        imageUrl: product.imageUrl,
        // إرجاع التصنيفات الفرعية كـ Object محدد يحتوي على id و name
        subcategories: product.subcategories.map(s => ({
            id: s.subcategory.id,
            name: s.subcategory.name,
            categoryId: s.subcategory.categoryId
        })),
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : "بدون تاريخ",
    }));
}

// ==========================================
// 2. جلب منتج واحد
// ==========================================
export async function getProductById(id: number) {
    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            subcategories: true,
            images: true,
        }
    });
    return product;
}

// ==========================================
// 3. إضافة أو تعديل منتج
// ==========================================
export async function saveProduct(formData: FormData, id?: number) {
    try {
        const name = formData.get("name") as string;
        const shortDescription = formData.get("shortDescription") as string;
        const longDescription = formData.get("longDescription") as string;
        const price = formData.get("price") as string;
        
        const subcategoryIds = formData.getAll("subcategories").map(subId => parseInt(subId as string));

        const mainImageFile = formData.get("mainImage") as File | null;
        const extraImageFiles = formData.getAll("extraImages") as File[];

        let mainImageUrl = null;
        if (mainImageFile && mainImageFile.size > 0) {
            mainImageUrl = await uploadFile(mainImageFile);
        }

        let productId = id;

        if (productId) {
            // --- حالة التعديل ---
            await db.update(products)
                .set({
                    name,
                    shortDescription,
                    longDescription,
                    price,
                    ...(mainImageUrl && { imageUrl: mainImageUrl })
                })
                .where(eq(products.id, productId));
        } else {
            // --- حالة الإضافة ---
            if (!mainImageUrl) throw new Error("الصورة الرئيسية مطلوبة");
            
            const [newProduct] = await db.insert(products).values({
                name,
                shortDescription,
                longDescription,
                price,
                imageUrl: mainImageUrl
            }).returning({ id: products.id });

            productId = newProduct.id;
        }

        // --- إدارة العلاقات (التصنيفات الفرعية) ---
        await db.delete(productSubcategories).where(eq(productSubcategories.productId, productId));
        
        if (subcategoryIds.length > 0) {
            const subcategoriesData = subcategoryIds.map(subId => ({
                productId: productId!,
                subcategoryId: subId
            }));
            await db.insert(productSubcategories).values(subcategoriesData);
        }

        // --- إدارة الصور الإضافية ---
        const validExtraImages = extraImageFiles.filter(file => file.size > 0);
        if (validExtraImages.length > 0) {
            for (const file of validExtraImages) {
                const extraImageUrl = await uploadFile(file);
                await db.insert(productImages).values({
                    productId: productId!,
                    imageUrl: extraImageUrl
                });
            }
        }

        revalidatePath("/admin/products");
        return { success: true };
    } catch (error: any) {
        console.error("Error saving product:", error);
        return { success: false, error: error.message || "حدث خطأ أثناء حفظ المنتج" };
    }
}

// ==========================================
// 4. حذف صورة إضافية معينة
// ==========================================
export async function deleteProductImage(imageId: number) {
    try {
        await db.delete(productImages).where(eq(productImages.id, imageId));
        revalidatePath("/admin/products");
        return { success: true };
    } catch (error) {
        return { success: false, error: "حدث خطأ أثناء حذف الصورة" };
    }
}

// ==========================================
// 5. حذف المنتج بالكامل
// ==========================================
export async function deleteProduct(id: number) {
    try {
        await db.delete(products).where(eq(products.id, id));
        revalidatePath("/admin/products");
        return { success: true };
    } catch (error) {
        return { success: false, error: "لا يمكن حذف المنتج لارتباطه بطلبات سابقة" };
    }
}