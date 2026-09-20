"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    ArrowRight,
    Search,
    SlidersHorizontal,
    X,
    Check,
    RotateCcw
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useMemo } from 'react';

// ==========================================
// الهياكل المرنة للتصنيفات والمنتجات
// ==========================================
export interface SubcategoryType {
    id: number;
    name: string;
    categoryId?: number;
}

export interface ProductType {
    id: number;
    name: string;
    shortDescription: string | null;
    price: string;
    imageUrl: string;
    // تدعم مختلف تسميات الاستعلام من قاعدة البيانات
    subcategories?: any[];
    productSubcategories?: any[];
}

interface ProductsPageUIProps {
    productsList?: ProductType[];
    subcategoriesList?: SubcategoryType[];
}

/**
 * دالة مساعدة لاستخراج التصنيفات الفرعية للمنتج بغض النظر عن طريقة إرجاعها من الباك إند
 */
function extractProductSubcategories(product: ProductType): SubcategoryType[] {
    const rawList = product.subcategories || product.productSubcategories || [];
    const result: SubcategoryType[] = [];

    rawList.forEach((item) => {
        if (!item) return;
        // حالة جدول الربط: { subcategory: { id, name } }
        if (item.subcategory && item.subcategory.id) {
            result.push(item.subcategory);
        }
        // حالة الكائن المباشر: { id, name }
        else if (item.id && item.name) {
            result.push(item);
        }
    });

    return result;
}

export default function ProductsPageUI({ 
    productsList = [], 
    subcategoriesList = [] 
}: ProductsPageUIProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    
    // الحالات (States)
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | "all">("all");
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // 1. تجميع واستخراج كل التصنيفات الفرعية المتاحة
    const availableSubcategories = useMemo(() => {
        if (subcategoriesList && subcategoriesList.length > 0) {
            return subcategoriesList;
        }

        const map = new Map<number, SubcategoryType>();
        productsList.forEach(product => {
            const subs = extractProductSubcategories(product);
            subs.forEach(sub => {
                if (sub && sub.id) {
                    map.set(Number(sub.id), sub);
                }
            });
        });

        return Array.from(map.values());
    }, [productsList, subcategoriesList]);

    // 2. تصفية المنتجات بناءً على البحث والتصنيف المحدد
    const filteredProducts = useMemo(() => {
        return productsList.filter(product => {
            // أ) فلتر البحث النصي
            const matchesSearch = 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (product.shortDescription && product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

            // ب) فلتر التصنيف الفرعي
            const productSubs = extractProductSubcategories(product);
            const matchesCategory = 
                selectedSubcategoryId === "all" || 
                productSubs.some(sub => Number(sub.id) === Number(selectedSubcategoryId));

            return matchesSearch && matchesCategory;
        });
    }, [productsList, searchQuery, selectedSubcategoryId]);

    // إعادة ضبط الفلاتر
    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedSubcategoryId("all");
    };

    return (
        <div className="bg-banan-bg min-h-screen pb-20 font-sans" dir="rtl">
            
            {/* ==================== TOP BAR & HEADER ==================== */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-banan-beige shadow-sm">
                <div className="container mx-auto px-4 py-4 space-y-3">
                    
                    {/* العناوين وعدد النتائج */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="w-10 h-10 bg-banan-bg rounded-full flex items-center justify-center text-banan-olive hover:bg-banan-olive hover:text-white transition-colors">
                                <ArrowRight size={20} />
                            </Link>
                            <h1 className="text-2xl font-black text-banan-olive">منتجاتنا</h1>
                        </div>
                        <span className="text-sm font-bold text-banan-brown bg-banan-bg border border-banan-beige/60 px-4 py-1.5 rounded-full">
                            {filteredProducts.length} منتج
                        </span>
                    </div>

                    {/* شريط البحث وزر لوحة التصفية */}
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="ابحثي عن مشروعك القادم..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-banan-beige rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-banan-olive focus:ring-1 focus:ring-banan-olive shadow-sm transition-all"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* زر فتح لوحة الفلترة */}
                        <button 
                            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-center relative ${
                                selectedSubcategoryId !== "all" 
                                    ? "bg-banan-olive text-white border-banan-olive" 
                                    : "bg-white border-banan-beige text-banan-olive hover:bg-banan-bg"
                            }`}
                            title="تصفية حسب التصنيف"
                        >
                            <SlidersHorizontal size={20} />
                            {selectedSubcategoryId !== "all" && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white" />
                            )}
                        </button>
                    </div>

                    {/* شريط التصنيفات الأفقي السريع (Chips) */}
                    {availableSubcategories.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs sm:text-sm">
                            <button
                                onClick={() => setSelectedSubcategoryId("all")}
                                className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                                    selectedSubcategoryId === "all"
                                        ? "bg-banan-olive text-white shadow-sm"
                                        : "bg-white text-banan-olive hover:bg-banan-bg border border-banan-beige/60"
                                }`}
                            >
                                الكل
                            </button>
                            {availableSubcategories.map((sub) => {
                                const isActive = Number(selectedSubcategoryId) === Number(sub.id);
                                return (
                                    <button
                                        key={sub.id}
                                        onClick={() => setSelectedSubcategoryId(sub.id)}
                                        className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold transition-all flex items-center gap-1.5 ${
                                            isActive
                                                ? "bg-banan-olive text-white shadow-sm"
                                                : "bg-white text-gray-600 hover:bg-banan-bg border border-banan-beige/60"
                                        }`}
                                    >
                                        <span>{sub.name}</span>
                                        {isActive && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            {/* ==================== FILTER PANEL DROPDOWN ==================== */}
            <AnimatePresence>
                {isFilterPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border-b border-banan-beige overflow-hidden shadow-inner z-30 relative"
                    >
                        <div className="container mx-auto px-4 py-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-banan-olive flex items-center gap-2">
                                    <SlidersHorizontal size={18} />
                                    <span>تصفية حسب التصنيف الفرعي</span>
                                </h3>
                                <button 
                                    onClick={handleResetFilters}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    <span>إعادة ضبط</span>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedSubcategoryId("all")}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        selectedSubcategoryId === "all"
                                            ? "bg-banan-olive text-white border-banan-olive"
                                            : "bg-banan-bg/50 text-gray-600 border-banan-beige hover:border-banan-olive"
                                    }`}
                                >
                                    عرض الكل
                                </button>
                                {availableSubcategories.map((sub) => {
                                    const isActive = Number(selectedSubcategoryId) === Number(sub.id);
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => setSelectedSubcategoryId(sub.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                                                isActive
                                                    ? "bg-banan-olive text-white border-banan-olive"
                                                    : "bg-banan-bg/50 text-gray-600 border-banan-beige hover:border-banan-olive"
                                            }`}
                                        >
                                            <span>{sub.name}</span>
                                            {isActive && <Check size={14} />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button 
                                    onClick={() => setIsFilterPanelOpen(false)}
                                    className="bg-banan-bg text-banan-olive text-xs font-bold px-5 py-2 rounded-xl border border-banan-beige hover:bg-banan-olive hover:text-white transition-colors"
                                >
                                    إغلاق اللوحة
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== PRODUCTS GRID ==================== */}
            <section className="container mx-auto px-4 py-8">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-banan-olive bg-white/40 rounded-3xl border border-dashed border-banan-beige p-8">
                        <Search size={48} className="mb-4 opacity-30 text-banan-brown" />
                        <h3 className="text-xl font-bold mb-2">لا توجد نتائج!</h3>
                        <p className="opacity-70 text-sm max-w-md mb-6">
                            لم نتمكن من العثور على منتجات تطابق الخيارات المحددة.
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="bg-banan-olive text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-banan-brown transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            <span>عرض جميع المنتجات</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => {
                            const productSubs = extractProductSubcategories(product);
                            const isFav = isInWishlist(product.id);

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -6 }} 
                                    key={product.id} 
                                    className="bg-white rounded-[2rem] p-4 shadow-sm border border-banan-beige/50 relative group flex flex-col h-full"
                                >
                                    {/* زر المفضلة التفاعلي */}
                                    <button 
                                        onClick={() => toggleWishlist({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            imageUrl: product.imageUrl,
                                            shortDescription: product.shortDescription
                                        })}
                                        className={`absolute top-6 left-6 p-2.5 rounded-full shadow-sm z-10 transition-all ${
                                            isFav 
                                                ? "bg-red-50 text-red-500 scale-110" 
                                                : "bg-white/90 backdrop-blur text-gray-400 hover:text-red-500 hover:scale-110"
                                        }`}
                                        title={isFav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                    >
                                        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                                    </button>

                                    {/* صورة المنتج */}
                                    <Link href={`/products/${product.id}`} className="block relative">
                                        <div className="aspect-square bg-banan-bg/40 rounded-3xl mb-5 overflow-hidden relative cursor-pointer">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            />
                                        </div>
                                    </Link>

                                    {/* تفاصيل المنتج */}
                                    <div className="flex flex-col flex-grow px-2">
                                        
                                        {/* شارات التصنيفات الفرعية */}
                                        {productSubs.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {productSubs.map((sub) => (
                                                    <span 
                                                        key={sub.id}
                                                        className="text-[10px] font-bold text-banan-brown bg-banan-bg px-2 py-0.5 rounded-md border border-banan-beige/40"
                                                    >
                                                        {sub.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <Link href={`/products/${product.id}`}>
                                            <h3 className="font-bold text-lg text-banan-olive mb-2 hover:text-banan-brown transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        
                                        <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed h-10">
                                            {product.shortDescription || "تفاصيل مميزة وإبداع لا حدود له في هذا المشروع."}
                                        </p>

                                        {/* السعر وزر الإضافة للسلة */}
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-banan-beige/30">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">السعر</span>
                                                <span className="font-black text-xl text-banan-olive">${product.price}</span>
                                            </div>
                                            
                                            <button
                                                onClick={() => addToCart({
                                                    id: product.id,
                                                    name: product.name,
                                                    price: product.price,
                                                    imageUrl: product.imageUrl
                                                })}
                                                className="bg-banan-bg p-3.5 rounded-2xl text-banan-olive hover:bg-banan-olive hover:text-white transform hover:scale-105 transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
                                                title="أضف إلى السلة"
                                            >
                                                <ShoppingBag size={20} />
                                                <span className="hidden sm:block text-sm font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity w-0 group-hover/btn:w-auto overflow-hidden whitespace-nowrap">
                                                    إضافة
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}