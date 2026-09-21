// app/products/page.tsx
import ProductsPageUI, { ProductType, SubcategoryType } from "@/components/ProductsPageUI";
import { db } from "@/db";
import { products, subcategories, productSubcategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. فك تشفير المعاملات
  const resolvedSearchParams = await searchParams;
  const subIdParam = resolvedSearchParams.subId;

  // 2. جلب جميع التصنيفات الفرعية المتاحة لعرضها في الفلتر العلوي
  const allSubcategoriesData = await db.query.subcategories.findMany();
  const formattedSubcategories: SubcategoryType[] = allSubcategoriesData.map(sub => ({
    id: sub.id,
    name: sub.name,
    categoryId: sub.categoryId ?? undefined
  }));

  // 3. جلب المنتجات مع التصنيفات الفرعية الخاصة بكل منتج (With Relations)
  let rawProducts: any[] = [];

  if (subIdParam && typeof subIdParam === 'string' && !isNaN(parseInt(subIdParam))) {
    const subcategoryId = parseInt(subIdParam);

    // عند الفلترة بـ subId
    const joinedResults = await db
      .select({
        product: products
      })
      .from(products)
      .innerJoin(
        productSubcategories,
        eq(products.id, productSubcategories.productId)
      )
      .where(eq(productSubcategories.subcategoryId, subcategoryId));

    const productIds = joinedResults.map(r => r.product.id);

    if (productIds.length > 0) {
      rawProducts = await db.query.products.findMany({
        where: (productsTable, { inArray }) => inArray(productsTable.id, productIds),
        with: {
          subcategories: {
            with: {
              subcategory: true
            }
          }
        }
      });
    }
  } else {
    // جلب كافة المنتجات مع علاقات التصنيفات الفرعية
    rawProducts = await db.query.products.findMany({
      with: {
        subcategories: {
          with: {
            subcategory: true
          }
        }
      }
    });
  }

  // 4. تنسيق البيانات لتطابق مع واجهة ProductType
  const formattedProducts: ProductType[] = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price.toString(),
    imageUrl: p.imageUrl,
    subcategories: p.subcategories ? p.subcategories.map((s: any) => ({
      id: s.subcategory.id,
      name: s.subcategory.name,
      categoryId: s.subcategory.categoryId
    })) : []
  }));

  return (
    <ProductsPageUI 
      productsList={formattedProducts} 
      subcategoriesList={formattedSubcategories} 
    />
  );
}