// app/products/[id]/page.tsx
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetailsUI, { ProductDetailsType } from "@/components/ProductDetailsUI";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. فك تشفير المعاملات (استخراج الـ id من الرابط)
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    return notFound(); // توجيه المستخدم لصفحة 404 إذا لم يكن الـ id رقماً
  }

  // 2. جلب تفاصيل المنتج باستخدام العلاقات (Relational Queries) الخاصة بـ Drizzle
  const productInfo = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      images: true, // جلب الصور الإضافية من جدول productImages
      subcategories: {
        with: {
          subcategory: true, // جلب تفاصيل التصنيف الفرعي (الاسم وغيره)
        },
      },
    },
  });

  // إذا لم يتم العثور على المنتج
  if (!productInfo) {
    return notFound(); 
  }

  // 3. تنسيق البيانات وتجهيزها للواجهة (تحويل السعر لنص)
  const formattedProduct: ProductDetailsType = {
    id: productInfo.id,
    name: productInfo.name,
    shortDescription: productInfo.shortDescription,
    longDescription: productInfo.longDescription,
    price: productInfo.price.toString(),
    imageUrl: productInfo.imageUrl,
    images: productInfo.images,
    subcategories: productInfo.subcategories,
  };

  // 4. تمرير البيانات للواجهة
  return <ProductDetailsUI product={formattedProduct} />;
}