"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageCircle, Share2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// مكون أيقونة إنستغرام مخصص (SVG)
function Instagram({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}


export default function FloatingButtons() {
    const [isSocialOpen, setIsSocialOpen] = useState(false);
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, cartItemsCount } = useCart();
    // رقم افتراضي لعدد العناصر في السلة (يمكنك ربطه لاحقاً بـ Context أو Redux)

    return (
        // تم وضعه في الزاوية اليسرى السفلية (لأن الموقع RTL، فاليسار هو الأفضل لكي لا يغطي شريط التمرير)
        // إذا أردته في اليمين، غير left-6 إلى right-6
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-4 items-center" dir="rtl">

            {/* زر السوشيال ميديا (يفتح قائمة) */}
            <div className="relative flex flex-col items-center">
                <AnimatePresence>
                    {isSocialOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="flex flex-col gap-3 mb-4 absolute bottom-full"
                        >
                            {/* زر واتساب */}
                            <a
                                href="https://wa.me/9639XXXXXXXX"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                            >
                                <MessageCircle size={22} />
                            </a>

                            {/* زر إنستغرام */}
                            <a
                                href="https://instagram.com/banaan_store"
                                target="_blank"
                                rel="noreferrer"
                                className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                            >
                                <Instagram size={22} />
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSocialOpen(!isSocialOpen)}
                    className="w-12 h-12 bg-white text-banan-brown rounded-full flex items-center justify-center shadow-md border border-banan-beige hover:bg-banan-bg transition-colors"
                >
                    {isSocialOpen ? <X size={20} /> : <Share2 size={20} />}
                </motion.button>
            </div>
            {/* زر السلة العائمة */}
            <motion.button
                onClick={() => setIsCartOpen(true)} // يفتح السلة الجانبية
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-16 h-16 bg-banan-olive text-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl hover:bg-banan-olive-light transition-all duration-300"
            >
                <ShoppingBag size={28} />

                {/* شارة عدد العناصر (ديناميكية الآن) */}
                {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-banan-brown text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-banan-bg shadow-sm">
                        {cartItemsCount}
                    </span>
                )}
            </motion.button>

        </div>
    );
}