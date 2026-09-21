import UserProfileUI from "@/components/UserProfileUI";
import { updateAvatarAction } from "../../actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  
  // 1. إعادة التوجيه لصفحة تسجيل الدخول إذا لم يكن العميل مسجلاً
  if (!clerkUser) {
    redirect("/sign-in");
  }

  const clerkEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

  // 2. البحث عن المستخدم في DB بواسطة clerkId أو الإيميل كخيار احتياطي
  const dbUser = await db.query.users.findFirst({
    where: clerkEmail
      ? or(eq(users.clerkId, clerkUser.id), eq(users.email, clerkEmail))
      : eq(users.clerkId, clerkUser.id),
  });

  if (!dbUser) {
    return (
      <div className="p-8 text-center dir-rtl">
        <p className="text-red-600 font-semibold">لم يتم العثور على بيانات الحساب في قاعدة البيانات.</p>
      </div>
    );
  }

  // 3. جلب جميع طلبات المستخدم وترتيبها من الأحدث للأقدم
  const userOrders = await db.query.orders.findMany({
    where: or(
      eq(orders.userId, dbUser.id),
      eq(orders.customerEmail, dbUser.email)
    ),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true, // لجلب بيانات المنتجات داخل كل طلب
        },
      },
    },
  });

  return (
    <UserProfileUI
      user={{
        id: dbUser.id,
        name: dbUser.name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "مستخدم",
        email: dbUser.email,
        imageUrl: dbUser.imageUrl || clerkUser.imageUrl,
        createdAt: dbUser.createdAt,
      }}
      ordersList={userOrders}
      onUpdateAvatar={updateAvatarAction}
    />
  );
}