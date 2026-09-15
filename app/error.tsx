"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // يمكنك هنا تسجيل الخطأ في خدمة تتبع مثل Sentry
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-banan-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-red-50"
            >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                    <AlertCircle size={40} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    أوبس! حدث خطأ غير متوقع
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                    نعتذر، واجهنا مشكلة بسيطة أثناء محاولة تنفيذ طلبك. جربي تحديث الصفحة.
                </p>
                
                <button
                    onClick={() => reset()}
                    className="bg-banan-brown text-white px-8 py-3 rounded-full font-bold shadow-md hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full"
                >
                    <RefreshCcw size={20} /> 
                    حاولي مرة أخرى
                </button>
            </motion.div>
        </div>
    );
}