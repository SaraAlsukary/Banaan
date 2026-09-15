"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; // تأكد من مسار الاستيراد الصحيح

export default function SideCart() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* خلفية معتمة (Overlay) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[1000] backdrop-blur-sm"
                    />

                    {/* قائمة السلة الجانبية */}
                    <motion.div
                        initial={{ x: '-100%' }} // ينزلق من اليسار
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 left-0 h-full w-full max-w-sm bg-banan-bg shadow-2xl z-[1001] flex flex-col"
                        dir="rtl"
                    >
                        {/* ترويسة السلة */}
                        <div className="p-4 border-b border-banan-beige flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-banan-olive flex items-center gap-2">
                                <ShoppingBag /> سلة المشتريات
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* محتوى السلة */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-70">
                                    <ShoppingBag size={64} />
                                    <p className="text-lg">سلة المشتريات فارغة</p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-banan-olive text-sm">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="font-black text-banan-olive">${Number(item.price).toFixed(2)}</span>
                                                <div className="flex items-center gap-3 bg-banan-bg rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-white rounded-md transition"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-white rounded-md transition"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* قسم الإجمالي والدفع */}
                        {cartItems.length > 0 && (
                            <div className="p-4 bg-white border-t border-banan-beige space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold text-banan-olive">
                                    <span>المجموع الإجمالي:</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <button className="w-full py-4 bg-banan-olive-light text-white rounded-xl font-bold text-lg hover:bg-banan-olive transition shadow-lg">
                                    إتمام الطلب
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}