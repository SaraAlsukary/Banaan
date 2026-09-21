"use client";

import { useState } from "react";

interface OrderItem {
  id: number;
  quantity: number;
  price: string | number;
  product?: {
    name: string;
    imageUrl?: string | null;
  } | null;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  notes?: string | null;
  totalAmount: string | number;
  status: string;
  createdAt: Date | string;
  items: OrderItem[];
}

export default function OrderDetailsModal({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر فتح Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-bold text-banan-olive bg-banan-beige/30 hover:bg-banan-beige/60 rounded-lg transition-colors border border-banan-beige"
      >
        عرض التفاصيل
      </button>

      {/* خلفية وشاشة Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-banan-beige max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* الهيدر */}
            <div className="p-4 border-b border-banan-beige flex justify-between items-center bg-banan-bg">
              <div>
                <h3 className="text-lg font-black text-banan-olive">
                  تفاصيل الطلب #ORD-{order.id}
                </h3>
                <p className="text-xs text-banan-olive/60">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* المحتوى القابل للتمرير */}
            <div className="p-6 overflow-y-auto space-y-6 text-right">
              {/* بيانات العميل والتوصيل */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-banan-beige/10 p-4 rounded-xl border border-banan-beige/40">
                <div>
                  <h4 className="text-xs font-bold text-banan-olive/60 mb-1">
                    معلومات العميل
                  </h4>
                  <p className="font-bold text-banan-olive">{order.customerName}</p>
                  <p className="text-xs text-banan-olive/80">{order.phone}</p>
                  <p className="text-xs text-banan-olive/60">{order.customerEmail}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-banan-olive/60 mb-1">
                    عنوان التوصيل
                  </h4>
                  <p className="text-sm text-banan-olive leading-relaxed">
                    {order.address}
                  </p>
                </div>
              </div>

              {/* ملاحظات العميل */}
              {order.notes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">ملاحظات العميل:</span>
                  {order.notes}
                </div>
              )}

              {/* قائمة العناصر/المنتجات */}
              <div>
                <h4 className="font-bold text-banan-olive mb-3">
                  المنتجات المطلوبة ({order.items.length})
                </h4>
                <div className="divide-y divide-banan-beige/40 border border-banan-beige rounded-xl overflow-hidden">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex items-center justify-between gap-4 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-banan-beige"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            لا صورة
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-banan-olive">
                            {item.product?.name || "منتج غير متوفر"}
                          </p>
                          <p className="text-xs text-banan-olive/60">
                            سعر الوحدة: ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-xs text-banan-olive/70 font-bold block">
                          الكمية: {item.quantity}
                        </span>
                        <span className="text-sm font-black text-banan-olive">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* إجمالي الحساب والحالة */}
              <div className="border-t border-banan-beige pt-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-banan-olive/60 block">حالة الطلب الحالية</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-banan-beige/40 text-banan-olive inline-block mt-1">
                    {order.status}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-banan-olive/60 block">الإجمالي الكلي</span>
                  <span className="text-xl font-black text-banan-olive">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* الفوتر */}
            <div className="p-4 border-t border-banan-beige bg-banan-bg flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-banan-olive text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}