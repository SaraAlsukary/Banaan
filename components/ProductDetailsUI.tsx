// components/ProductDetailsUI.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { 
    ShoppingBag, 
    Check, 
    Plus, 
    Minus, 
    Truck, 
    ShieldCheck, 
    Sparkles, 
    Info,
    Heart 
} from "lucide-react";

export type ProductDetailsType = {
    id: number;
    name: string;
    shortDescription: string | null;
    longDescription: string | null;
    price: string;
    imageUrl: string;
    images: { id: number; imageUrl: string }[];
    subcategories: { subcategory: { id: number; name: string } }[];
};

export default function ProductDetailsUI({ product }: { product: ProductDetailsType }) {
    const [activeImage, setActiveImage] = useState(product.imageUrl);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart } = useCart();

    const allImages = [
        { id: 0, imageUrl: product.imageUrl },
        ...product.images,
    ];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
            });
        }
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-[var(--color-banan-bg)] py-10 md:py-16 font-sans text-right" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                
                {/* كرت المنتج الرئيسي */}
                <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-banan-beige)] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                        {/* ==================== قسم الصور (5 أعمدة) ==================== */}
                        <div className="lg:col-span-5 p-6 md:p-8 bg-gradient-to-b from-[var(--color-banan-bg)]/60 to-white flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-[var(--color-banan-beige)]/40">
                            <div className="space-y-4">
                                
                                {/* الصورة الرئيسية مع زر المفضلة والشارة */}
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-[var(--color-banan-beige)]/60 group">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeImage}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full relative"
                                        >
                                            <Image
                                                src={activeImage}
                                                alt={product.name}
                                                fill
                                                priority
                                                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                    
                                    {/* شارة الجودة */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--color-banan-olive)] shadow-sm flex items-center gap-1.5 border border-[var(--color-banan-beige)] z-10">
                                        <Sparkles size={14} className="text-[var(--color-banan-brown)]" />
                                        <span>منتج مميز</span>
                                    </div>

                                    {/* زر إضافة إلى المفضلة */}
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={toggleFavorite}
                                        className={`absolute top-4 left-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 border shadow-sm ${
                                            isFavorite
                                                ? "bg-rose-50 text-rose-500 border-rose-200"
                                                : "bg-white/80 text-gray-400 hover:text-rose-500 border-[var(--color-banan-beige)]"
                                        }`}
                                        aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                    >
                                        <Heart
                                            size={20}
                                            className={`transition-colors duration-300 ${
                                                isFavorite ? "fill-rose-500 text-rose-500" : ""
                                            }`}
                                        />
                                    </motion.button>
                                </div>

                                {/* معرض الصور المصغرة */}
                                {allImages.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 pt-2 scrollbar-none">
                                        {allImages.map((img) => {
                                            const isActive = activeImage === img.imageUrl;
                                            return (
                                                <button
                                                    key={img.id}
                                                    onClick={() => setActiveImage(img.imageUrl)}
                                                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${
                                                        isActive
                                                            ? "border-[var(--color-banan-olive)] shadow-md ring-2 ring-[var(--color-banan-olive)]/20 scale-105"
                                                            : "border-transparent bg-white opacity-60 hover:opacity-100 hover:shadow-sm"
                                                    }`}
                                                >
                                                    <Image
                                                        src={img.imageUrl}
                                                        alt={`صورة مصغرة ${product.name}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ==================== قسم التفاصيل (7 أعمدة) ==================== */}
                        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
                            <div className="space-y-6">
                                
                                {/* التصنيفات */}
                                {product.subcategories.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {product.subcategories.map((sub) => (
                                            <span
                                                key={sub.subcategory.id}
                                                className="px-3.5 py-1 bg-[var(--color-banan-beige)]/60 text-[var(--color-banan-olive)] text-xs font-bold rounded-full border border-[var(--color-banan-beige)]"
                                            >
                                                {sub.subcategory.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* العنوان والأسعار */}
                                <div className="space-y-3">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-banan-olive)] leading-tight">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-baseline gap-2 pt-1">
                                        <span className="text-3xl sm:text-4xl font-black text-[var(--color-banan-brown)]">
                                            {Number(product.price).toLocaleString()}
                                        </span>
                                        <span className="text-3xl font-bold text-[var(--color-banan-brown)]">$</span>
                                    </div>
                                </div>

                                {/* الوصف القصير */}
                                {product.shortDescription && (
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed bg-[var(--color-banan-bg)]/40 p-4 rounded-2xl border border-[var(--color-banan-beige)]/40">
                                        {product.shortDescription}
                                    </p>
                                )}

                                {/* أدوات التحكم بالكمية وإضافة للسلة */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                        
                                        {/* عداد الكمية */}
                                        <div className="flex items-center justify-between border-2 border-[var(--color-banan-beige)] rounded-2xl p-1 bg-white sm:w-36">
                                            <button
                                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-[var(--color-banan-bg)] transition-colors"
                                                aria-label="إنقاص الكمية"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-bold text-lg text-[var(--color-banan-olive)] w-8 text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity((prev) => prev + 1)}
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-[var(--color-banan-bg)] transition-colors"
                                                aria-label="زيادة الكمية"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* زر الإضافة للسلة */}
                                        <button
                                            onClick={handleAddToCart}
                                            className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 shadow-md ${
                                                isAdded
                                                    ? "bg-emerald-600 text-white shadow-emerald-200"
                                                    : "bg-[var(--color-banan-olive)] hover:bg-[var(--color-banan-brown)] text-white shadow-[var(--color-banan-olive)]/20 hover:-translate-y-0.5"
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check size={22} className="animate-bounce" />
                                                    <span>تمت الإضافة بنجاح!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag size={22} />
                                                    <span>إضافة إلى السلة</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* مميزات الشراء والضمان */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-banan-beige)]/60 text-xs md:text-sm text-gray-600">
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--color-banan-bg)]/30">
                                        <Truck size={18} className="text-[var(--color-banan-brown)] shrink-0" />
                                        <span>توصيل سريع لكافة المناطق</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--color-banan-bg)]/30">
                                        <ShieldCheck size={18} className="text-[var(--color-banan-brown)] shrink-0" />
                                        <span>جودة عالية ومضمونة</span>
                                    </div>
                                </div>

                                {/* الوصف التفصيلي */}
                                {product.longDescription && (
                                    <div className="pt-6 border-t border-[var(--color-banan-beige)]">
                                        <h2 className="text-lg font-bold text-[var(--color-banan-olive)] mb-3 flex items-center gap-2">
                                            <Info size={18} className="text-[var(--color-banan-brown)]" />
                                            <span>تفاصيل المنتج الشاملة</span>
                                        </h2>
                                        <div className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap pl-2">
                                            {product.longDescription}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}