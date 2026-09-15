"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    ArrowRight,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

// مطابقة لهيكل قاعدة البيانات الخاص بك
export interface ProductType {
    id: number;
    name: string;
    shortDescription: string | null;
    price: string;
    imageUrl: string;
}

interface ProductsPageUIProps {
    productsList?: ProductType[];
}

export default function ProductsPageUI({ productsList = [] }: ProductsPageUIProps) {
    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState("");

    // بيانات وهمية للعرض في حال لم يتم تمرير منتجات من قاعدة البيانات
    const defaultProducts: ProductType[] = [
        {
            id: 1,
            name: 'طقم تطريز لافندر متكامل',
            shortDescription: 'حقيبة تحتوي على كل ما تحتاجينه لبدء التطريز، مع خيوط قطنية وإطار خشبي وفيديو تعليمي.',
            price: '15.99',
            imageUrl: 'https://images.unsplash.com/photo-1620162589998-90b9b39cc598?w=500&q=80'
        },
        {
            id: 2,
            name: 'إطار أرنب Punch Needle',
            shortDescription: 'مشروع لطيف وسهل للمبتدئين في فن الإبرة الدقيقة (البانش نيدل)، مثالي لغرف الأطفال.',
            price: '18.99',
            imageUrl: 'https://images.unsplash.com/photo-1616422329399-5231713d0fc3?w=500&q=80'
        },
        {
            id: 3,
            name: 'زهرة دوار الشمس كروشيه',
            shortDescription: 'مجموعة كروشيه لصنع زهرة دوار الشمس التي لا تذبل أبداً. تتضمن سنارة وخيوط عالية الجودة.',
            price: '16.99',
            imageUrl: 'https://images.unsplash.com/photo-1605277157835-0814d4ebf086?w=500&q=80'
        },
        {
            id: 4,
            name: 'ميدالية بطريق بالخرز',
            shortDescription: 'اصنعي ميداليتك الخاصة بتصميم بطريق لطيف باستخدام خرز زجاجي لامع وسلك نحاسي.',
            price: '14.99',
            imageUrl: 'https://images.unsplash.com/photo-1596484552993-80e9df74c3e8?w=500&q=80'
        },
        {
            id: 5,
            name: 'أدوات التلبيد الأساسية',
            shortDescription: 'مجموعة إبر تلبيد بمقاسات مختلفة مع وسادة إسفنجية لحماية السطح أثناء العمل.',
            price: '12.50',
            imageUrl: 'https://images.unsplash.com/photo-1588607149811-0e1c2de95e69?w=500&q=80'
        }
    ];

    const displayProducts = productsList.length > 0 ? productsList : defaultProducts;

    // تصفية المنتجات بناءً على شريط البحث
    const filteredProducts = displayProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-banan-bg min-h-screen pb-20" dir="rtl">
            
            {/* قسم الترويسة العلوية (Header) */}
            <div className="bg-white/60 backdrop-blur-md sticky top-0 z-40 border-b border-banan-beige">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="w-10 h-10 bg-banan-bg rounded-full flex items-center justify-center text-banan-olive hover:bg-banan-olive hover:text-white transition-colors">
                                <ArrowRight size={20} />
                            </Link>
                            <h1 className="text-2xl font-black text-banan-olive">منتجاتنا</h1>
                        </div>
                        <span className="text-sm font-bold text-banan-brown bg-banan-bg px-4 py-1.5 rounded-full">
                            {filteredProducts.length} منتج
                        </span>
                    </div>

                    {/* شريط البحث والفلترة */}
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
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-banan-olive focus:ring-1 focus:ring-banan-olive shadow-sm transition-all"
                            />
                        </div>
                        <button className="bg-white border border-gray-100 p-3 rounded-2xl text-banan-olive shadow-sm hover:bg-banan-bg transition-colors flex items-center justify-center">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* شبكة المنتجات (Product Grid) */}
            <section className="container mx-auto px-4 py-8">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-banan-olive">
                        <Search size={48} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold mb-2">لا توجد نتائج!</h3>
                        <p className="opacity-70">لم نتمكن من العثور على منتجات تطابق بحثك.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }} 
                                key={product.id} 
                                className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50 relative group flex flex-col h-full"
                            >
                                {/* زر المفضلة */}
                                <button className="absolute top-6 left-6 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 z-10 transition-all">
                                    <Heart size={18} />
                                </button>

                                {/* صورة المنتج */}
                                <Link href={`/products/${product.id}`} className="block relative">
                                    <div className="aspect-square bg-gray-50 rounded-3xl mb-5 overflow-hidden relative cursor-pointer">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                        {/* طبقة شفافة تظهر عند المرور */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </Link>

                                {/* تفاصيل المنتج (الاسم + الوصف القصير) */}
                                <div className="flex flex-col flex-grow px-2">
                                    <Link href={`/products/${product.id}`}>
                                        <h3 className="font-bold text-lg text-banan-olive mb-2 hover:text-banan-brown transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    
                                    {/* الوصف القصير (المطلوب) */}
                                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed h-10">
                                        {product.shortDescription || "تفاصيل مميزة وإبداع لا حدود له في هذا المشروع."}
                                    </p>

                                    {/* السعر وزر الإضافة للسلة في الأسفل */}
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
                                            {/* تظهر الكلمة في الشاشات الأكبر فقط لجمالية التصميم */}
                                            <span className="hidden sm:block text-sm font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity w-0 group-hover/btn:w-auto overflow-hidden">
                                                إضافة
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}