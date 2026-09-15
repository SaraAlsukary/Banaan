"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, Star, Truck, ShieldCheck } from "lucide-react";
// 1. استيراد سياق السلة
import { useCart } from "@/context/CartContext";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    
    // 2. استخراج العداد من السياق
    const { cartItemsCount, setIsCartOpen } = useCart(); 

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'التصنيفات', path: '/categories' },
        { name: 'المنتجات', path: '/products' },
        { name: 'من نحن', path: '/about' },
        { name: 'تواصل معنا', path: '/contact' },
    ];

    return (
        <>
            {/* شريط الإعلانات العلوي */}
            <div className="bg-banan-olive-light text-white text-sm py-2 hidden md:flex justify-center gap-12 font-medium">
                <span className="flex items-center gap-1.5"><Star size={14} /> منتجات مختارة بعناية</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> دفع آمن 100%</span>
                <span className="flex items-center gap-1.5"><Truck size={14} /> توصيل سريع لجميع المحافظات</span>
            </div>

            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-banan-beige/50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    
                    {/* Logo */}
                    <Link href="/" className="w-20 md:w-30 font-extrabold flex items-center gap-2">
                        <Image src="/logo.png" alt="بنان" width={120} height={40} priority />
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-8 space-x-reverse font-semibold">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`transition-colors duration-200 relative py-1 text-lg p-2 ${
                                    pathname === link.path
                                        ? 'text-banan-olive font-bold border-b-2 border-banan-brown'
                                        : 'text-banan-olive/70 hover:text-banan-brown'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Icons */}
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-4 text-banan-olive/80">
                            <button className="hover:text-banan-brown transition-colors">
                                <Search size={20} />
                            </button>
                            <button className="hover:text-banan-brown transition-colors">
                                <User size={20} />
                            </button>
                            
                            {/* 3. تعديل أيقونة السلة للشاشات الكبيرة */}
                            <button 
                                onClick={() => setIsCartOpen(true)} 
                                className="hover:text-banan-brown transition-colors relative"
                            >
                                <ShoppingBag size={20} />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-banan-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1 text-banan-olive">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col space-y-3 overflow-hidden"
                        >
                            <div className="flex justify-around py-3 mb-2 border-b border-gray-100 text-banan-olive">
                                <Search size={22} />
                                <User size={22} />
                                
                                {/* 4. تعديل أيقونة السلة للجوال */}
                                <button 
                                    onClick={() => {
                                        setIsCartOpen(true);
                                        setIsMenuOpen(false); // إغلاق القائمة عند فتح السلة
                                    }} 
                                    className="relative"
                                >
                                    <ShoppingBag size={22} />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-banan-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="py-2 text-base font-medium border-b border-gray-50 text-banan-olive"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}