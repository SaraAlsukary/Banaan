"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-banan-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-sm border border-banan-beige"
            >
                <div className="w-24 h-24 bg-banan-beige/40 rounded-full flex items-center justify-center mx-auto mb-6 text-banan-brown">
                    <SearchX size={48} />
                </div>
                
                <h1 className="text-6xl font-black text-banan-olive mb-4 drop-shadow-sm">
                    404
                </h1>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    عذراً، الصفحة غير موجودة!
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                    يبدو أن الصفحة التي تبحثين عنها قد تم نقلها أو أنها لم تعد متوفرة. لا تقلقي، دعينا نعود للبداية.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/" 
                        className="w-full sm:w-auto bg-banan-olive text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-banan-olive-light transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                    >
                        <Home size={20} /> 
                        العودة للرئيسية
                    </Link>
                    <Link 
                        href="/products" 
                        className="w-full sm:w-auto bg-banan-bg text-banan-olive px-8 py-3 rounded-full font-bold hover:bg-banan-beige transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        تسوقي المشاريع <ArrowLeft size={20} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}