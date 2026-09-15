// components/ProductDetailsUI.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

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
    const { addToCart } = useCart();

    const allImages = [
        { id: 0, imageUrl: product.imageUrl },
        ...product.images,
    ];

    return (
        // استخدام لون الخلفية الأساسي للموقع
        <div className="min-h-screen bg-[var(--color-banan-bg)] py-12 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-banan-beige)] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* ==================== قسم الصور ==================== */}
                        <div className="p-6 md:p-10 bg-[var(--color-banan-bg)]/50">
                            <div className="flex flex-col gap-6">
                                {/* الصورة الكبيرة */}
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-[var(--color-banan-beige)]/50 group">
                                    <Image
                                        src={activeImage}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* معرض الصور المصغرة */}
                                {allImages.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                        {allImages.map((img) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setActiveImage(img.imageUrl)}
                                                className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${activeImage === img.imageUrl
                                                        ? "border-[var(--color-banan-olive)] shadow-md"
                                                        : "border-transparent bg-white opacity-70 hover:opacity-100 hover:shadow-sm"
                                                    }`}
                                            >
                                                <Image
                                                    src={img.imageUrl}
                                                    alt={`صورة مصغرة ${product.name}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ==================== قسم التفاصيل ==================== */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">

                            {/* التصنيفات */}
                            {product.subcategories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.subcategories.map((sub) => (
                                        <span
                                            key={sub.subcategory.id}
                                            className="px-4 py-1.5 bg-[var(--color-banan-beige)] text-[var(--color-banan-olive)] text-sm font-semibold rounded-full tracking-wide"
                                        >
                                            {sub.subcategory.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* العنوان */}
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-banan-olive)] mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* السعر */}
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-extrabold text-[var(--color-banan-brown)]">
                                    {product.price}
                                </span>
                                <span className="text-xl text-[var(--color-banan-brown)]/80 font-medium">ر.س</span>
                            </div>

                            {/* الوصف القصير */}
                            {product.shortDescription && (
                                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                    {product.shortDescription}
                                </p>
                            )}

                            {/* زر الإضافة للسلة */}
                            <button onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                imageUrl: product.imageUrl
                            })} className="group flex items-center justify-center gap-3 w-full md:w-fit px-10 py-4 bg-[var(--color-banan-olive)] hover:bg-[var(--color-banan-olive-light)] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-[var(--color-banan-olive)]/30 hover:-translate-y-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 transition-transform group-hover:scale-110"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                إضافة إلى السلة
                            </button>

                            <hr className="my-10 border-[var(--color-banan-beige)]" />

                            {/* الوصف الطويل */}
                            {product.longDescription && (
                                <div className="mt-2">
                                    <h2 className="text-xl font-bold text-[var(--color-banan-olive)] mb-4 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-banan-brown)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        تفاصيل المنتج
                                    </h2>
                                    <div className="prose prose-lg text-gray-600 leading-loose whitespace-pre-wrap">
                                        {product.longDescription}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}