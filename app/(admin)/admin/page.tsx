import { db } from "@/db";
import { orders, products, users } from "@/db/schema";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";
import { count, desc, sum } from "drizzle-orm";

// إعادة تنشيط البيانات تلقائياً في كل زيارة
export const revalidate = 0;

export default async function AdminOverviewPage() {
  // 1. جلب إجمالي المبيعات (مجموع totalAmount للطلبات الناجحة)
  const salesResult = await db
    .select({ total: sum(orders.totalAmount) })
    .from(orders);
  const totalSales = Number(salesResult[0]?.total || 0);

  // 2. جلب إجمالي عدد الطلبات
  const ordersCountResult = await db
    .select({ count: count(orders.id) })
    .from(orders);
  const totalOrders = Number(ordersCountResult[0]?.count || 0);

  // 3. جلب إجمالي عدد المنتجات
  const productsCountResult = await db
    .select({ count: count(products.id) })
    .from(products);
  const totalProducts = Number(productsCountResult[0]?.count || 0);

  // 4. جلب إجمالي عدد العملاء المسجلين
  const usersCountResult = await db
    .select({ count: count(users.id) })
    .from(users);
  const totalUsers = Number(usersCountResult[0]?.count || 0);

  // 5. جلب أحدث 5 طلبات مع تفاصيل العميل والتاريخ
  const recentOrders = await db
    .select({
      id: orders.id,
      customerName: orders.customerName,
      createdAt: orders.createdAt,
      totalAmount: orders.totalAmount,
      status: orders.status,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-banan-olive">نظرة عامة</h2>

      {/* شبكة الإحصائيات الحقيقية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المبيعات"
          value={`$${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="محدث"
          positive
        />
        <StatCard
          title="إجمالي الطلبات"
          value={totalOrders.toString()}
          change="محدث"
          positive
        />
        <StatCard
          title="إجمالي المنتجات"
          value={totalProducts.toString()}
          change="محدث"
        />
        <StatCard
          title="العملاء المسجلين"
          value={totalUsers.toString()}
          change="محدث"
          positive
        />
      </div>

      {/* أحدث الطلبات الديناميكية */}
      <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
        <div className="p-4 border-b border-banan-beige flex justify-between items-center bg-banan-beige/20">
          <h3 className="font-bold text-banan-olive">أحدث الطلبات</h3>
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-banan-olive-light hover:underline"
          >
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-banan-bg text-banan-olive/70">
              <tr>
                <th className="p-4 font-bold">رقم الطلب</th>
                <th className="p-4 font-bold">العميل</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">المبلغ</th>
                <th className="p-4 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-banan-beige/40">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-banan-olive/60"
                  >
                    لا توجد طلبات حتى الآن.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-banan-bg/50 transition-colors"
                  >
                    <td className="p-4 font-mono text-banan-brown font-bold">
                      #ORD-{order.id}
                    </td>
                    <td className="p-4 font-bold text-banan-olive">
                      {order.customerName}
                    </td>
                    <td className="p-4 text-banan-olive/60">
                      {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-black text-banan-olive">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="p-4">
                      {order.status === "pending" ? (
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                          قيد المعالجة (Pending)
                        </span>
                      ) : order.status === "completed" ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                          مكتمل (Completed)
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                          {order.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}