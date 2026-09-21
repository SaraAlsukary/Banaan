"use client";

import { deleteUser } from "@/app/actions/user";
import { useState, useTransition } from "react";

export default function DeleteUserButton({ userId, userName }: { userId: number; userName: string | null }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmMessage = `هل أنت تأكد من رغبتك في حذف المستخدم "${userName || `#${userId}`}"؟`;
    if (confirm(confirmMessage)) {
      startTransition(async () => {
        const res = await deleteUser(userId);
        if (!res.success) {
          alert(res.error || "فشل الحذف");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
    >
      {isPending ? "جاري الحذف..." : "حذف"}
    </button>
  );
}