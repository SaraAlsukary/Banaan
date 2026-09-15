import { db } from "@/db";
import { categories, subcategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import CategoryCard from "@/components/CategoryCard";
import { notFound } from "next/navigation";

export default async function SubCategoriesPage({ params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id);

  // التأكد من أن الـ id رقم صحيح
  if (isNaN(categoryId)) {
    notFound();
  }

  // جلب اسم التصنيف الأساسي للعنوان
  const mainCategory = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
  
  if (mainCategory.length === 0) {
    notFound(); // إرجاع صفحة 404 إذا لم يكن التصنيف موجوداً
  }

  // جلب التصنيفات الفرعية المرتبطة بهذا التصنيف الأساسي
  const subs = await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        تفرعات: {mainCategory[0].name}
      </h1>
      
      {subs.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد تصنيفات فرعية هنا بعد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.map((sub) => (
            <CategoryCard
              key={sub.id}
              id={sub.id}
              name={sub.name}
              imageUrl={sub.imageUrl}
              href={`/products?subId=${sub.id}`} // توجيه لصفحة المنتجات الخاصة بهذا التصنيف الفرعي
              linkText="عرض المنتجات"
            />
          ))}
        </div>
      )}
    </div>
  );
}