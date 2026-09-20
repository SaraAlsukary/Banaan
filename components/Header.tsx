"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, Star, Truck, ShieldCheck, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";

// مكون مخصص لإدارة حالة تسجيل الدخول وتجنب مشاكل الـ Hydration

function AuthActions({ isMobile = false, onCloseMenu }: { isMobile?: boolean; onCloseMenu?: () => void }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser(); // 👈 جلب بيانات المستخدم لعرض صورته

  // هيكل تحميلي مؤقت أثناء جلب حالة التوثيق
  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <Link 
        href="/profile" 
        onClick={onCloseMenu}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        title="الملف الشخصي"
      >
        {/* عرض صورة حساب المستخدم من كليك */}
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName || "الحساب الشخصي"}
            width={isMobile ? 32 : 36}
            height={isMobile ? 32 : 36}
            className="rounded-full border border-banan-olive/20 object-cover"
          />
        ) : (
          <User size={isMobile ? 22 : 20} className="text-banan-olive" />
        )}
      </Link>
    );
  }

  return (
    <SignInButton mode="modal">
      <button 
        onClick={onCloseMenu}
        className={
          isMobile 
            ? "flex items-center gap-1 text-xs font-bold text-banan-olive"
            : "flex items-center gap-1.5 bg-banan-olive text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-banan-brown transition-colors"
        }
      >
        <LogIn size={isMobile ? 18 : 15} />
        <span>{isMobile ? "دخول" : "تسجيل الدخول"}</span>
      </button>
    </SignInButton>
  );
}
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
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

          {/* Action Icons - Desktop */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-4 text-banan-olive/80">
              <button className="hover:text-banan-brown transition-colors" aria-label="بحث">
                <Search size={20} />
              </button>
              
              {/* زر السلة */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="hover:text-banan-brown transition-colors relative"
                aria-label="سلة التسوق"
              >
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-banan-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* أزرار التوثيق والحساب */}
              <AuthActions />
            </div>

            {/* زر القائمة للشاشات الصغيرة */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-1 text-banan-olive"
              aria-label="القائمة"
            >
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
              <div className="flex justify-around items-center py-3 mb-2 border-b border-gray-100 text-banan-olive">
                <button aria-label="بحث">
                  <Search size={22} />
                </button>
                
                {/* السلة للجوال */}
                <button 
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMenuOpen(false);
                  }} 
                  className="relative"
                  aria-label="سلة التسوق"
                >
                  <ShoppingBag size={22} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-banan-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* تسجيل الدخول/الحساب للجوال */}
                <AuthActions isMobile onCloseMenu={() => setIsMenuOpen(false)} />
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2 text-base font-medium border-b border-gray-50 ${
                    pathname === link.path ? 'text-banan-brown font-bold' : 'text-banan-olive'
                  }`}
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