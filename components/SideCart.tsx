"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function SideCart() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    // التمرير وزر Esc
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsCartOpen(false);
        };

        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isCartOpen, setIsCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* خلفية معتمة */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[1000] backdrop-blur-sm"
                    />

                    {/* القائمة الجانبية (ينزلق من اليمين) */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-banan-bg shadow-2xl z-[1001] flex flex-col"
                        dir="rtl"
                    >
                        {/* ترويسة السلة */}
                        <div className="p-4 border-b border-banan-beige flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-banan-olive flex items-center gap-2">
                                <ShoppingBag className="text-banan-brown" /> سلة المشتريات
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"
                                aria-label="إغلاق السلة"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* محتوى السلة */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-70">
                                    <ShoppingBag size={64} className="stroke-1 text-banan-olive" />
                                    <p className="text-lg font-bold">سلة المشتريات فارغة</p>
                                    <button 
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-sm text-banan-brown hover:underline font-bold"
                                    >
                                        تصفحي المنتجات الآن
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-banan-beige/40">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-banan-olive text-sm">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-400 hover:text-red-600 transition p-1"
                                                    title="حذف المنتج"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="font-black text-banan-olive text-sm">
                                                    {Number(item.price).toLocaleString()} $
                                                </span>
                                                <div className="flex items-center gap-2 bg-banan-bg rounded-lg p-1 border border-banan-beige/30">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 bg-white rounded-md hover:bg-gray-100 transition shadow-xs"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 bg-white rounded-md hover:bg-gray-100 transition shadow-xs"
                                                    >
                                                        <Plus size={12} />
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
                                    <span className="text-xl font-black">{cartTotal.toLocaleString()} $</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-3.5 bg-banan-olive text-white rounded-xl font-bold text-base hover:bg-banan-brown transition shadow-md flex items-center justify-center gap-2"
                                >
                                    <span>إتمام الطلب</span>
                                    <ArrowLeft size={18} />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}