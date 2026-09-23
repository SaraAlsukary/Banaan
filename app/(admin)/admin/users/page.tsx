import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import DeleteUserButton from "./DeleteUserButton";

export const revalidate = 0;

export default async function UsersPage() {
  try {
    // جلب كافة المستخدمين مرتبين من الأحدث للأقدم
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return (
      <div className="space-y-6">
        {/* الهيدر والعنوان */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-banan-olive">إدارة المستخدمين</h2>
            <p className="text-xs text-banan-olive/60 mt-1">عرض وحذف الحسابات المسجلة في النظام</p>
          </div>
          <span className="bg-banan-beige/40 text-banan-olive px-3 py-1 rounded-full text-sm font-bold">
            إجمالي المستخدمين: {allUsers.length}
          </span>
        </div>

        {/* جدول البيانات */}
        <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-banan-bg text-banan-olive/70 border-b border-banan-beige">
                <tr>
                  <th className="p-4 font-bold">المستخدم</th>
                  <th className="p-4 font-bold">البريد الإلكتروني</th>
                  <th className="p-4 font-bold">معرف Clerk</th>
                  <th className="p-4 font-bold">تاريخ التسجيل</th>
                  <th className="p-4 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-banan-beige/40">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-banan-olive/60">
                      لا يوجد مستخدمون مسجلون حتى الآن.
                    </td>
                  </tr>
                ) : (
                  allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-banan-bg/30 transition-colors">
                      {/* بيانات وصورة المستخدم */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt={user.name || "مستخدم"}
                              className="w-10 h-10 rounded-full object-cover border border-banan-beige"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-banan-beige/40 text-banan-olive flex items-center justify-center font-bold text-sm">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-banan-olive">
                              {user.name || "بدون اسم"}
                            </div>
                            <div className="text-[11px] text-banan-olive/50 font-mono">
                              #ID-{user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* البريد الإلكتروني */}
                      <td className="p-4 font-medium text-banan-olive/80">
                        {user.email}
                      </td>

                      {/* Clerk ID */}
                      <td className="p-4 font-mono text-xs text-banan-brown">
                        {user.clerkId}
                      </td>

                      {/* تاريخ التسجيل مع التحقق حماية من الأخطاء */}
                      <td className="p-4 text-xs text-banan-olive/60 whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "غير محدد"}
                      </td>

                      {/* زر الحذف */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <DeleteUserButton userId={user.id} userName={user.name} />
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
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدمين:", error);
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl">
        حدث خطأ أثناء تحميل بيانات المستخدمين. يرجى التحقق من الاتصال بقاعدة البيانات.
      </div>
    );
  }
}