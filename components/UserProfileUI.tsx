"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs"; // استيراد hooks الخاصة بـ Clerk
import {
  User,
  Package,
  Heart,
  Camera,
  ShoppingBag,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Mail,
  Calendar,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export interface UserProfileData {
  id: number;
  clerkId?: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  createdAt: string | Date;
}

export interface OrderItemData {
  id: number;
  productId: number | null;
  quantity: number;
  price: string;
  product?: {
    name: string;
    imageUrl: string;
  } | null;
}

export interface OrderData {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  status: "pending" | "completed" | "cancelled" | string;
  createdAt: string | Date;
  items?: OrderItemData[];
}

interface UserProfileUIProps {
  user: UserProfileData;
  ordersList?: OrderData[];
  onUpdateAvatar?: (formData: FormData) => Promise<string>;
}

export default function UserProfileUI({
  user,
  ordersList = [],
  onUpdateAvatar,
}: UserProfileUIProps) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // جلب كائن المستخدم ودالة تسجيل الخروج من Clerk
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user.imageUrl || "/images/default-avatar.png"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);

    if (onUpdateAvatar) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const newUploadedUrl = await onUpdateAvatar(formData);
        if (newUploadedUrl) {
          setAvatarUrl(newUploadedUrl);
        }
      } catch (error) {
        console.error("فشل رفع الصورة الشخصية:", error);
        setAvatarUrl(user.imageUrl || "/images/default-avatar.png");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // دالة التعامل مع حذف الحساب
  const handleDeleteAccount = async () => {
    if (!clerkUser) return;
    try {
      setIsDeleting(true);
      // 1. حذف حساب المستخدم من Clerk (سيعالج Webhook حذف البيانات من Postgres/Drizzle)
      await clerkUser.delete();
      // 2. إنهاء الجلسة وإعادة التوجيه للرئيسية
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("فشل حذف الحساب:", error);
      alert("حدث خطأ أثناء حذف الحساب، يرجى المحاولة لاحقاً.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={14} /> مكتمل
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle size={14} /> ملغى
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock size={14} /> قيد المعالجة
          </span>
        );
    }
  };

  return (
    <div className="bg-banan-bg min-h-screen pb-20 font-sans" dir="rtl">
      {/* الشريط العلوي */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-banan-beige shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 bg-banan-bg rounded-full flex items-center justify-center text-banan-olive hover:bg-banan-olive hover:text-white transition-colors"
            >
              <ArrowRight size={20} />
            </Link>
            <h1 className="text-xl font-black text-banan-olive">حسابي الشخصي</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* بطاقة التعريف الشخصية */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-banan-beige/60 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-banan-beige/50 bg-banan-bg shadow-inner relative flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name || "المستخدم"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-banan-brown/40" />
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 bg-banan-olive text-white p-2.5 rounded-full shadow-md hover:bg-banan-brown transition-transform transform active:scale-95 disabled:opacity-50"
                title="تغيير الصورة الشخصية"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-center md:text-right flex-grow space-y-2">
              <h2 className="text-2xl font-black text-banan-olive">
                {user.name || "مستخدم محترم"}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail size={16} className="text-banan-brown" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-banan-brown" />
                  عضو منذ {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-r border-banan-beige/60 justify-center md:pr-6">
              <div className="text-center px-3 py-1">
                <span className="block text-2xl font-black text-banan-olive">
                  {ordersList.length}
                </span>
                <span className="text-xs font-bold text-gray-400">الطلبات</span>
              </div>
              <div className="text-center px-3 py-1">
                <span className="block text-2xl font-black text-banan-olive">
                  {wishlist.length}
                </span>
                <span className="text-xs font-bold text-gray-400">المفضلة</span>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التبويب */}
        <div className="flex border-b border-banan-beige mb-6 gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-banan-olive text-banan-olive"
                : "border-transparent text-gray-400 hover:text-banan-brown"
            }`}
          >
            <Package size={18} />
            <span>طلباتي ({ordersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "wishlist"
                ? "border-banan-olive text-banan-olive"
                : "border-transparent text-gray-400 hover:text-banan-brown"
            }`}
          >
            <Heart size={18} />
            <span>المفضلة ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "border-banan-olive text-banan-olive"
                : "border-transparent text-gray-400 hover:text-banan-brown"
            }`}
          >
            <User size={18} />
            <span>بيانات الحساب</span>
          </button>
        </div>

        {/* محتوى التبويبات */}
        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div
              key="orders-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {ordersList.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-banan-beige p-6">
                  <Package size={48} className="mx-auto mb-3 text-banan-brown/30" />
                  <h3 className="text-lg font-bold text-banan-olive mb-1">
                    لا توجد طلبات حتى الآن
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    لم تقومي بإجراء أي طلبات شفرة أو مشاريع بعد.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-banan-olive text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-banan-brown transition-colors"
                  >
                    <span>استكشاف المنتجات</span>
                  </Link>
                </div>
              ) : (
                ordersList.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-banan-beige/60 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-banan-beige/40">
                      <div>
                        <span className="text-xs font-bold text-gray-400 block">
                          رقم الطلب #{order.id}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <span className="text-lg font-black text-banan-olive">
                          ${order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-banan-bg/40 p-2.5 rounded-xl border border-banan-beige/30"
                          >
                            <img
                              src={
                                item.product?.imageUrl ||
                                "/images/product-placeholder.png"
                              }
                              alt={item.product?.name || "منتج"}
                              className="w-12 h-12 rounded-lg object-cover bg-white"
                            />
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-bold text-banan-olive truncate">
                                {item.product?.name || `منتج رقم #${item.productId}`}
                              </h4>
                              <span className="text-[11px] text-gray-400 font-medium">
                                الكمية: {item.quantity} × ${item.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-banan-beige p-6">
                  <Heart size={48} className="mx-auto mb-3 text-banan-brown/30" />
                  <h3 className="text-lg font-bold text-banan-olive mb-1">
                    المفضلة فارغة
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    احفظي المنتجات التي تعجبك للوصول إليها بسهولة لاحقاً.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-banan-olive text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-banan-brown transition-colors"
                  >
                    <span>تصفح المعرض</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-banan-beige/60 p-4 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-square bg-banan-bg/40 rounded-xl mb-3 overflow-hidden relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 left-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                            title="إزالة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-banan-olive line-clamp-1 mb-1">
                          {item.name}
                        </h4>
                        <span className="font-black text-banan-brown text-base block mb-3">
                          ${item.price}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            imageUrl: item.imageUrl,
                          })
                        }
                        className="w-full bg-banan-bg text-banan-olive border border-banan-beige py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-banan-olive hover:text-white transition-all"
                      >
                        <ShoppingBag size={15} />
                        <span>نقل إلى السلة</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl border border-banan-beige/60 p-6 md:p-8 space-y-6"
            >
              <h3 className="text-lg font-bold text-banan-olive border-b border-banan-beige/40 pb-3">
                تفاصيل الحساب
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">
                    الاسم كامل
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.name || "غير محدد"}
                    className="w-full bg-banan-bg/30 border border-banan-beige rounded-xl py-3 px-4 text-sm font-bold text-banan-olive outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full bg-banan-bg/30 border border-banan-beige rounded-xl py-3 px-4 text-sm font-bold text-banan-olive outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-banan-beige/40 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-banan-olive text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-banan-brown transition-colors shadow-sm"
                >
                  <Camera size={16} />
                  <span>تحديث الصورة الشخصية</span>
                </button>

                {/* زر حذف الحساب */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-rose-50 text-rose-600 border border-rose-200 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-xs"
                >
                  <Trash2 size={16} />
                  <span>حذف الحساب نهائياً</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* نافذة تأكيد حذف الحساب (Modal) */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-banan-beige text-center space-y-5"
              >
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900">
                    تأكيد حذف الحساب
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    هل أنتِ متأكدة من رغبتكِ في حذف الحساب؟ سينتج عن هذا إجراء نهائي وسيتم حذف جميع البيانات المرتبطة بالحساب ولا يمكن التراجع عنه.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1 bg-rose-600 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    <span>نعم، إزالة الحساب</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}