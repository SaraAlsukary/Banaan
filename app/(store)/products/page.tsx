// app/products/page.tsx
import ProductsPageUI, { ProductType } from "@/components/ProductsPageUI";
import { db } from "@/db";
import { products, productSubcategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. فك تشفير المعاملات
  const resolvedSearchParams = await searchParams;
  const subIdParam = resolvedSearchParams.subId;

  let productsList: any[] = [];

  // نحدد الحقول التي نريد إرجاعها لتكون مسطحة (Flat Object) متوافقة مع الواجهة
  const selectedFields = {
    id: products.id,
    name: products.name,
    shortDescription: products.shortDescription,
    price: products.price,
    imageUrl: products.imageUrl,
  };

  // 2. التحقق من وجود رقم تصنيف فرعي في الرابط
  if (subIdParam && typeof subIdParam === 'string' && !isNaN(parseInt(subIdParam))) {
    const subcategoryId = parseInt(subIdParam);
    
    // استخدام innerJoin للربط بين جدول المنتجات والجدول الوسيط
    productsList = await db
      .select(selectedFields)
      .from(products)
      .innerJoin(
        productSubcategories, 
        eq(products.id, productSubcategories.productId)
      )
      .where(eq(productSubcategories.subcategoryId, subcategoryId));

  } else {
    // إذا لم يكن هناك فلتر، نجلب كل المنتجات
    productsList = await db
      .select(selectedFields)
      .from(products);
  }

  // 3. تنسيق البيانات (تحويل السعر إلى String لتجنب أخطاء Typescript مع الواجهة)
  const formattedProducts: ProductType[] = productsList.map(product => ({
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    price: product.price.toString(), 
    imageUrl: product.imageUrl
  }));

  return <ProductsPageUI productsList={formattedProducts} />;
}