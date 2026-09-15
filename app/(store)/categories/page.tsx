import { db } from "@/db";
import { categories } from "@/db/schema";
import CategoryCard from "@/components/CategoryCard";

export default async function MainCategoriesPage() {
    // جلب جميع التصنيفات الأساسية من قاعدة البيانات
    const allCategories = await db.select().from(categories);

    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <h1 className="text-4xl font-bold mb-8 text-center">التصنيفات الأساسية</h1>

            {allCategories.length === 0 ? (
                <p className="text-center text-gray-500">لا توجد تصنيفات حالياً.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCategories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            id={cat.id}
                            name={cat.name}
                            imageUrl={cat.imageUrl}
                            href={`/categories/${cat.id}`} // توجيه لصفحة التصنيفات الفرعية
                            linkText="عرض التصنيفات الفرعية"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}