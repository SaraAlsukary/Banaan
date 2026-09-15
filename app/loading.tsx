"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-banan-bg flex flex-col items-center justify-center space-y-6">
            <motion.div
                animate={{ 
                    rotate: [0, 180, 360],
                    scale: [1, 1.1, 1] 
                }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-banan-brown border border-banan-beige"
            >
                <Scissors size={32} />
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="flex items-center gap-2 text-banan-olive font-bold text-lg"
            >
                <span>جاري تجهيز الخيوط والأدوات...</span>
            </motion.div>
        </div>
    );
}