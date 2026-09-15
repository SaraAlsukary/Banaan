"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link"; // استخدام Link الخاص بـ Next.js

interface CategoryProps {
  id: number;
  name: string;
  imageUrl: string | null;
  href: string;
  linkText?: string;
}

export default function CategoryCard({ id, name, imageUrl, href, linkText = "عرض الفرعيات" }: CategoryProps) {
  console.log(id)
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#ebebd2] overflow-hidden rounded-2xl shadow-sm border border-[#4A5D23]/15 flex flex-col justify-between"
    >
      {/* عرض الصورة */}
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-8 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
        </div>
        <div className="flex justify-end items-center mt-6 pt-4 border-t border-[#4A5D23]/10">
          <Link href={href} className="flex items-center text-sm font-bold gap-1 hover:underline text-[#4A5D23]">
            {linkText} <ChevronLeft size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}