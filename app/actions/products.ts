"use server";
import { db } from "@/db";
import { 
    products, 
    productImages, 
    productSubcategories, 
    // subcategories 
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ==========================================
// دالة مساعدة لرفع الصور محلياً (Helper Function)
// ==========================================
async function uploadFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeFileName);
    await writeFile(filePath, buffer);
    
    return `/uploads/products/${safeFileName}`;
}

// ==========================================
// 1. جلب جميع المنتجات (مع تصنيفاتها لعرضها في الجدول)
// ==========================================
export async function getProducts() {
    // نستخدم Drizzle Relational Queries لجلب المنتج مع صوره وتصنيفاته بسهولة
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

    // تبسيط شكل البيانات لتسهيل عرضها في الجدول
    return data.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        // جلب أسماء التصنيفات ودمجها كنص واحد (مثال: "تطريز، حقائب")
        categoriesNames: product.subcategories.map(s => s.subcategory.name).join('، '),
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : "بدون تاريخ",
    }));
}

// ==========================================
// 2. جلب منتج واحد (لصفحة التعديل)
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
// 3. إضافة أو تعديل منتج (Create / Update)
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
        // نقوم بحذف القديم ثم إدخال الجديد بشكل منفصل
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
// 4. حذف صورة إضافية معينة (حذف صورة واحدة من الصور الإضافية)
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
        // بفضل (`onDelete: "cascade"`) في ملف الـ Schema، 
        // حذف المنتج سيقوم تلقائياً بحذف الصور الإضافية وعلاقات التصنيفات المرتبطة به.
        await db.delete(products).where(eq(products.id, id));
        revalidatePath("/admin/products");
        return { success: true };
    } catch (error) {
        return { success: false, error: "لا يمكن حذف المنتج لارتباطه بطلبات سابقة" };
    }
}