"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, Send } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { submitOrder } from "@/app/actions/order";
export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [completedOrderId, setCompletedOrderId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setIsSubmitting(true);
        setErrorMessage("");

        const result = await submitOrder({
            customerName: formData.name,
            customerEmail: formData.email,
            phone: formData.phone,
            address: formData.address,
            notes: formData.notes,
            totalAmount: cartTotal,
            items: cartItems.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity,
            })),
        });

        setIsSubmitting(false);

        if (result.success && result.orderId) {
            setCompletedOrderId(result.orderId);
            setIsSuccess(true);
            clearCart();
        } else {
            setErrorMessage(result.error || "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
        }
    };

    // شاشة النجاح بعد إتمام الطلب
    if (isSuccess) {
        return (
            <div className="bg-banan-bg min-h-screen py-16 text-right" dir="rtl">
                <div className="container mx-auto px-4 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-banan-beige text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 size={48} />
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-banan-olive mb-2">تم إرسال طلبك بنجاح!</h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                شكراً لثقتك بمتجر <strong className="text-banan-brown">بَنان</strong>. رقم طلبك هو{" "}
                                <span className="font-bold text-banan-olive">#{completedOrderId}</span>
                            </p>
                        </div>

                        <div className="bg-banan-bg p-4 rounded-2xl text-xs md:text-sm text-gray-700 space-y-2 border border-banan-beige/50">
                            <p> تم إرسال رسالة تأكيد تتضمن تفاصيل الطلب إلى بريدك الإلكتروني:</p>
                            <p className="font-bold text-banan-brown dir-ltr text-center">{formData.email}</p>
                            <p className="text-gray-500 pt-1">سنتواصل معك قريباً عبر الواتساب لتأكيد الشحن والتسليم.</p>
                        </div>

                        <div className="pt-4">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-banan-olive text-white font-bold rounded-xl hover:bg-banan-brown transition shadow-md w-full"
                            >
                                <ArrowRight size={18} />
                                <span>العودة للرئيسية</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // إذا كانت السلة فارغة
    if (cartItems.length === 0) {
        return (
            <div className="bg-banan-bg min-h-screen py-20 text-right" dir="rtl">
                <div className="container mx-auto px-4 max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-banan-olive border border-banan-beige">
                        <ShoppingBag size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-banan-olive">سلة المشتريات فارغة</h1>
                    <p className="text-gray-600 text-sm">لم تقمي بإضافة أي منتجات للسلة بعد لتتمكي من إتمام الطلب.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 py-3 px-6 bg-banan-olive text-white font-bold rounded-xl hover:bg-banan-brown transition shadow-sm"
                    >
                        <span>تصفحي المنتجات</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-banan-bg min-h-screen py-10 text-right" dir="rtl">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-8 border-b border-banan-beige pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-banan-olive">إتمام الطلب</h1>
                        <p className="text-gray-600 text-xs mt-2 md:text-sm">أدخلي معلومات التسليم  </p>
                    </div>
                    <Link href="/" className="text-sm font-bold text-banan-brown hover:underline flex items-center gap-1">
                        <ArrowRight size={16} /> العودة للتسوق
                    </Link>
                </div>

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* نموذج البيانات */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-banan-beige space-y-5">
                            <h2 className="text-lg font-bold text-banan-olive border-b border-banan-beige pb-3">بيانات الشحن والتوصيل</h2>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="مثال: سارة أحمد"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-banan-olive text-sm bg-gray-50/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-banan-olive text-sm bg-gray-50/50 dir-ltr text-right"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">رقم الواتساب / الهاتف *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="09XXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-banan-olive text-sm bg-gray-50/50 dir-ltr text-right"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">العنوان المفصل (المحافظة / المدينة / المنطقة) *</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="مثال: حلب - الفرقان - بالقرب من..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-banan-olive text-sm bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات إضافية (اختياري)</label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="أي تفاصيل خاصة بالتوصيل أو الألوان..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-banan-olive text-sm bg-gray-50/50 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-banan-olive text-white font-bold rounded-xl hover:bg-banan-brown transition shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>جاري تأكيد الطلب...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>تأكيد الطلب الآن</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ملخص الطلب */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-banan-beige sticky top-6 space-y-4">
                            <h2 className="text-lg font-bold text-banan-olive border-b border-banan-beige pb-3">ملخص المشتريات</h2>

                            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 bg-banan-bg/50 p-2.5 rounded-2xl border border-banan-beige/30">
                                        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-gray-100 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-banan-olive text-xs truncate">{item.name}</h4>
                                            <p className="text-gray-500 text-xs mt-1">
                                                الكمية: {item.quantity} × {Number(item.price).toLocaleString()} $
                                            </p>
                                        </div>
                                        <span className="font-black text-banan-olive text-xs">
                                            {(Number(item.price) * item.quantity).toLocaleString()} $
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-banan-beige pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>طريقة الدفع:</span>
                                    <span className="font-bold text-banan-olive">الدفع عند الاستلام</span>
                                </div>
                                <div className="flex justify-between items-center text-base font-black text-banan-olive pt-2 border-t border-gray-100">
                                    <span>المجموع الكلي:</span>
                                    <span className="text-xl text-banan-brown">{cartTotal.toLocaleString()} $</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}