import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import OrderStatusSelector from "./OrderStatusSelector";
import OrderDetailsModal from "./OrderDetailsModal";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-banan-olive">إدارة الطلبات</h2>
        <span className="bg-banan-beige/40 text-banan-olive px-3 py-1 rounded-full text-sm font-bold">
          إجمالي الطلبات: {allOrders.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-banan-bg text-banan-olive/70 border-b border-banan-beige">
              <tr>
                <th className="p-4 font-bold">رقم الطلب</th>
                <th className="p-4 font-bold">العميل والتواصل</th>
                <th className="p-4 font-bold">العنوان</th>
                <th className="p-4 font-bold">المنتجات</th>
                <th className="p-4 font-bold">المبلغ الإجمالي</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">تغيير الحالة</th>
                <th className="p-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-banan-beige/40">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-banan-olive/60">
                    لا توجد طلبات مسجلة حتى الآن.
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-banan-bg/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-banan-brown whitespace-nowrap">
                      #ORD-{order.id}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-banan-olive">{order.customerName}</div>
                      <div className="text-xs text-banan-olive/70">{order.phone}</div>
                      <div className="text-xs text-banan-olive/50">{order.customerEmail}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="text-xs text-banan-olive line-clamp-2">{order.address}</div>
                      {order.notes && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 p-1 rounded mt-1">
                          ملاحظة: {order.notes}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-xs text-banan-olive/80">
                            <span className="font-bold">{item.product?.name || "منتج محذوف"}</span> × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="p-4 font-black text-banan-olive whitespace-nowrap">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>

                    <td className="p-4 text-xs text-banan-olive/60 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                    </td>

                    {/* زر تفاصيل الطلب الكرتوني المنبثق */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <OrderDetailsModal order={order} />
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