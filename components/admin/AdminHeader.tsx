"use client";

import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function AdminHeader() {
    return (
        <header className="h-16 bg-white border-b border-banan-beige flex items-center justify-between px-6 shrink-0">
            {/* شريط البحث */}
            <div className="relative w-96">
                <input 
                    type="text" 
                    placeholder="ابحث عن طلب، منتج، أو مستخدم..." 
                    className="w-full bg-banan-bg border border-banan-beige rounded-xl pl-4 pr-10 py-2 focus:ring-2 focus:ring-banan-olive-light focus:border-transparent outline-none text-sm text-banan-olive placeholder:text-banan-brown/60 transition-all"
                />
                <Search className="absolute right-3 top-2.5 text-banan-brown" size={18} />
            </div>

            {/* التنبيهات والأدوات */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-banan-olive hover:bg-banan-bg rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-banan-brown rounded-full"></span>
                </button>
            </div>
        </header>
    );
}