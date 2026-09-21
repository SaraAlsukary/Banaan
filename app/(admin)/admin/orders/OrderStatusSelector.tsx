"use client";

import { updateOrderStatus } from "@/app/actions/order";
import { useState, useTransition } from "react";

interface OrderStatusSelectorProps {
  orderId: number;
  currentStatus: string;
}

export default function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res.success) {
        setStatus(currentStatus); // إرجاع الحالة السابقة عند الفشل
        alert("حدث خطأ أثناء تغيير الحالة");
      }
    });
  };

  const getStatusColor = (statusVal: string) => {
    switch (statusVal) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="relative inline-block">
      <select
        disabled={isPending}
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer transition-all outline-none ${getStatusColor(
          status
        )} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <option value="pending">قيد المعالجة (Pending)</option>
        <option value="completed">مكتمل (Completed)</option>
        <option value="cancelled">ملغى (Cancelled)</option>
      </select>
      {isPending && (
        <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 text-[10px] text-banan-olive/60 animate-pulse">
          جاري...
        </span>
      )}
    </div>
  );
}