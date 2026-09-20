"use client";

import Link from 'next/link';
import Image from 'next/image';
import { UserButton } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Play,
    Gift,
    Truck,
    HeadphonesIcon,
    Heart,
    ArrowLeft,
    Star,
    Phone,
    MapPin,
    Clock,
    // Instagram
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface CategoryItem {
    id: number;
    name: string;
    imageUrl: string | null;
}
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
export interface ProductItem {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
    tag?: string | null;
}

interface HomePageUIProps {
    isLoggedIn: boolean;
    firstName: string;
    hasDbUser: boolean;
    categoriesList?: CategoryItem[];
    bestsellersList?: ProductItem[];
}

export default function HomePageUI({
    isLoggedIn,
    firstName,
    hasDbUser,
    categoriesList = [],
    bestsellersList = []
}: HomePageUIProps) {

    // بيانات افتراضية للتصنيفات في حال عدم توفرها
    const defaultCategories: CategoryItem[] = [
        { id: 1, name: 'التلبيد', imageUrl: 'https://images.unsplash.com/photo-1588607149811-0e1c2de95e69?w=300&q=80' },
        { id: 2, name: 'التطريز', imageUrl: 'https://images.unsplash.com/photo-1620162589998-90b9b39cc598?w=300&q=80' },
        { id: 3, name: 'ميداليات الخرز', imageUrl: 'https://images.unsplash.com/photo-1596484552993-80e9df74c3e8?w=300&q=80' },
        { id: 4, name: 'الكروشيه', imageUrl: 'https://images.unsplash.com/photo-1605277157835-0814d4ebf086?w=300&q=80' },
        { id: 5, name: 'Punch Needle', imageUrl: 'https://images.unsplash.com/photo-1616422329399-5231713d0fc3?w=300&q=80' },
    ];

    // بيانات افتراضية للمنتجات
    const defaultProducts: ProductItem[] = [
        { id: 1, name: 'طقم تطريز لافندر', price: '15.99', imageUrl: 'https://images.unsplash.com/photo-1620162589998-90b9b39cc598?w=300', tag: null },
        { id: 2, name: 'إطار أرنب Punch Needle', price: '18.99', imageUrl: 'https://images.unsplash.com/photo-1616422329399-5231713d0fc3?w=300', tag: 'جديد' },
        { id: 3, name: 'زهرة دوار الشمس كروشيه', price: '16.99', imageUrl: 'https://images.unsplash.com/photo-1605277157835-0814d4ebf086?w=300', tag: null },
        { id: 4, name: 'ميدالية بطريق', price: '14.99', imageUrl: 'https://images.unsplash.com/photo-1596484552993-80e9df74c3e8?w=300', tag: 'الأفضل مبيعاً' },
    ];

    const displayCategories = categoriesList.length > 0 ? categoriesList : defaultCategories;
    const displayProducts = bestsellersList.length > 0 ? bestsellersList : defaultProducts;
    const { addToCart } = useCart();
    const bgColors = ['bg-rose-100', 'bg-green-100', 'bg-orange-100', 'bg-red-100', 'bg-purple-100'];

    return (
        <div className="bg-banan-bg min-h-screen" dir="rtl">
            {/* شريط حالة المستخدم العلوي */}


            {/* 1. قسم البداية (Hero Section) */}
            <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full z-0 opacity-40">
                    <Image
                        src="/landing.jpg"
                        alt="Banaan Cover"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center h-full w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-banan-bg/90 backdrop-blur-md text-banan-brown px-6 py-2 rounded-full text-base md:text-lg font-bold mb-8 shadow-sm"
                    >
                        ✨ مشاريع صغيرة، متعة كبيرة
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-3xl lg:text-5xl font-black mb-8 leading-tight text-banan-olive drop-shadow-xl"
                    >
                        كل ما تحتاجه
                        لتصنعها بيديك،
                        في حقيبة واحدة.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl mb-12 max-w-3xl text-gray-900 font-bold drop-shadow-md leading-relaxed"
                    >
                        حقائب متكاملة تحتوي على الأدوات والخامات مع فيديو تعليمي خطوة بخطوة.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            href="/products"
                            className="bg-banan-olive-light text-white px-10 py-4 rounded-full text-lg md:text-xl font-bold shadow-2xl hover:bg-banan-olive hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            تسوق الآن <ArrowLeft size={24} />
                        </Link>

                        {/* <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
                            <div className="flex -space-x-4 space-x-reverse">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm relative">
                                        <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-base font-bold text-banan-olive text-right">
                                +1500 <br /><span className="text-sm font-normal opacity-90">عميلة سعيدة</span>
                            </div>
                        </div> */}
                    </motion.div>
                </div>
            </section>

            {/* 2. قسم المميزات */}
            <section className="container mx-auto px-4 py-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-banan-beige flex flex-wrap justify-center md:justify-between gap-6">
                    {[
                        { icon: <Truck className="text-banan-brown" size={28} />, title: 'توصيل سريع', desc: 'لجميع المحافظات' },
                        { icon: <HeadphonesIcon className="text-banan-brown" size={28} />, title: 'دعم سريع', desc: 'نحن معك دائماً' },
                        { icon: <Star className="text-banan-brown" size={28} />, title: 'خامات عالية الجودة', desc: 'مختارة بعناية' },
                        { icon: <Play className="text-banan-brown" size={28} />, title: 'فيديو تعليمي', desc: 'خطوة بخطوة' },
                        { icon: <Gift className="text-banan-brown" size={28} />, title: 'تغليف أنيق', desc: 'جاهز للإهداء' },
                    ].map((f, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-2 min-w-[120px]">
                            <div className="w-14 h-14 rounded-2xl bg-banan-bg flex items-center justify-center">
                                {f.icon}
                            </div>
                            <h4 className="font-bold text-sm text-banan-olive">{f.title}</h4>
                            <p className="text-xs opacity-70">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. قسم التصنيفات الأساسية (ديناميكي) */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-banan-olive">
                        ✨ تسوقي حسب المشروع
                    </h2>
                    <Link href="/categories" className="text-sm font-bold text-banan-olive-light hover:underline flex items-center gap-1">
                        <ArrowLeft size={16} /> عرض جميع التصنيفات
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {displayCategories.slice(0, 5).map((cat, idx) => (
                        <Link href={`/categories/${cat.id}`} key={cat.id}>
                            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center group cursor-pointer">
                                <div className={`w-full aspect-square rounded-3xl ${bgColors[idx % bgColors.length]} p-2 mb-3 overflow-hidden shadow-sm`}>
                                    <img
                                        src={cat.imageUrl || 'https://via.placeholder.com/300'}
                                        alt={cat.name}
                                        className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <span className="font-bold text-banan-olive text-center">{cat.name}</span>
                                <span className="text-xs opacity-60">تنسيقات مميزة</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 4. الأكثر مبيعاً (ديناميكي) */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-8 text-banan-olive">
                    🤍 الأكثر مبيعاً
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {displayProducts.map((product) => (
                        <motion.div whileHover={{ y: -5 }} key={product.id} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-50 relative group flex flex-col justify-between">
                            {product.tag && (
                                <span className="absolute top-5 right-5 bg-banan-brown text-white text-xs px-2 py-1 rounded-full z-10">
                                    {product.tag}
                                </span>
                            )}
                            <button className="absolute top-5 left-5 bg-white p-2 rounded-full shadow hover:text-red-500 z-10 transition-colors">
                                <Heart size={16} />
                            </button>

                            <div>
                                <Link href={`/products/${product.id}`}>
                                    <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative cursor-pointer">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </Link>

                                <div className="px-2 pb-2">
                                    <Link href={`/products/${product.id}`}>
                                        <h3 className="font-bold text-banan-olive mb-2 hover:underline cursor-pointer">{product.name}</h3>
                                    </Link>
                                </div>
                            </div>

                            <div className="px-2 pb-2 flex justify-between items-center mt-2">
                                <span className="font-black text-lg text-banan-olive">${product.price}</span>
                                <button
                                    // ربط الزر بدالة الإضافة
                                    onClick={() => addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        imageUrl: product.imageUrl
                                    })}
                                    className="bg-banan-bg p-2 rounded-xl text-banan-olive hover:bg-banan-olive-light hover:text-white transition-colors"
                                >
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. قسم معلومات التواصل */}
            <section className="container mx-auto px-4 py-12 mb-8">
                <div className="bg-banan-beige/40 rounded-3xl p-8 border border-banan-beige">
                    <h3 className="font-bold text-2xl mb-8 text-center text-banan-olive flex items-center justify-center gap-2">
                        📞 تواصل معنا
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-banan-olive">
                        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-banan-bg flex items-center justify-center text-banan-brown">
                                <Phone size={24} />
                            </div>
                            <h4 className="font-bold">رقم الهاتف / واتساب</h4>
                            <p className="text-sm dir-ltr opacity-80">+963 9XX XXX XXX</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-banan-bg flex items-center justify-center text-banan-brown">
                                <Instagram size={24} />
                            </div>
                            <h4 className="font-bold">إنستغرام</h4>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-sm opacity-80 hover:underline">
                                @banaan_store
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-banan-bg flex items-center justify-center text-banan-brown">
                                <MapPin size={24} />
                            </div>
                            <h4 className="font-bold">العنوان</h4>
                            <p className="text-sm opacity-80">سوريا، حلب</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-banan-bg flex items-center justify-center text-banan-brown">
                                <Clock size={24} />
                            </div>
                            <h4 className="font-bold">ساعات العمل</h4>
                            <p className="text-sm opacity-80">السبت - الخميس: 9:00 ص - 6:00 م</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}