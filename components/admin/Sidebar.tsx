"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Tags, 
    Layers, 
    Users, 
    ShoppingCart 
} from 'lucide-react';

interface NavItem {
    href: string;
    text: string;
    icon: React.ReactNode;
}

export default function Sidebar() {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { href: '/admin', text: 'نظرة عامة', icon: <LayoutDashboard size={20} /> },
        { href: '/admin/orders', text: 'الطلبات', icon: <ShoppingCart size={20} /> },
        { href: '/admin/products', text: 'المنتجات', icon: <ShoppingBag size={20} /> },
        { href: '/admin/categories', text: 'التصنيفات', icon: <Tags size={20} /> },
        { href: '/admin/subcategories', text: 'التصنيفات الفرعية', icon: <Layers size={20} /> },
        { href: '/admin/users', text: 'المستخدمين', icon: <Users size={20} /> },
    ];

    return (
        <aside className="w-64 bg-white border-l border-banan-beige flex flex-col h-full shrink-0">
            {/* الشعار / عنوان اللوحة */}
            <div className="h-16 flex items-center justify-center border-b border-banan-beige px-4">
                <h1 className="text-2xl font-black text-banan-olive">لوحة الإدارة</h1>
            </div>
            
            {/* روابط التنقل */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                                isActive 
                                ? 'bg-banan-beige/50 text-banan-olive shadow-sm' 
                                : 'text-banan-olive/70 hover:bg-banan-bg hover:text-banan-olive'
                            }`}
                        >
                            <span className={isActive ? 'text-banan-olive' : 'text-banan-brown'}>
                                {item.icon}
                            </span>
                            <span>{item.text}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* بطاقة معلومات المشرف */}
            <div className="p-4 border-t border-banan-beige bg-banan-bg/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-banan-beige flex items-center justify-center text-banan-olive font-bold border border-banan-brown/20">
                        أ.م
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-banan-olive truncate">أدمن المتجر</p>
                        <p className="text-xs text-banan-brown truncate">admin@store.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}