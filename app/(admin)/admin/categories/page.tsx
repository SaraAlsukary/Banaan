"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, AlertTriangle, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteCategory, getCategories, saveCategory } from '@/app/actions/categories';

// 💡 قم بفك التعليق عن هذه الاستيرادات عند توفر ملف الأكشن الخاص بك
// import { getCategories, createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'; 

interface Category {
    id: number;
    name: string;
    imageUrl: string | null;
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // جلب البيانات عند تحميل الصفحة
    const fetchCategoriesData = async () => {
        const data = await getCategories();
        setCategories(data as any);

    };

    useEffect(() => {
        fetchCategoriesData();
    }, []);

    // فتح نافذة الإضافة أو التعديل
    const openAddEditModal = (category?: Category) => {
        setSelectedCategory(category || null);
        if (category) {
            setName(category.name);
            setImagePreview(category.imageUrl || null);
            setImageFile(null);
        } else {
            setName('');
            setImagePreview(null);
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    // فتح نافذة الحذف
    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    // معاينة الصورة
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // الإرسال (إضافة أو تعديل)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (imageFile) formData.append("image", imageFile);

        try {
            // محاكاة الإرسال للسيرفر (استبدلها بالدوال الحقيقية)
            // const actionPromise = new Promise((resolve) => setTimeout(resolve, 1000));

            // 💡 الكود الحقيقي:
            let actionPromise;
            if (selectedCategory) {
                actionPromise = saveCategory(formData, selectedCategory.id,);
            } else {
                actionPromise = saveCategory(formData);
            }


            await toast.promise(actionPromise, {
                loading: selectedCategory ? 'جاري تحديث التصنيف...' : 'جاري إضافة التصنيف...',
                success: selectedCategory ? 'تم التعديل بنجاح!' : 'تم الحفظ بنجاح!',
                error: 'حدث خطأ غير متوقع',
            });

            setIsModalOpen(false);
            fetchCategoriesData(); // تحديث الجدول
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // الحذف
    const confirmDelete = async () => {
        if (!selectedCategory) return;
        setIsLoading(true);

        try {
            // محاكاة الحذف
            // const deletePromise = new Promise((resolve) => setTimeout(resolve, 1000));

            // 💡 الكود الحقيقي:
            const deletePromise = deleteCategory(selectedCategory.id);

            await toast.promise(deletePromise, {
                loading: 'جاري الحذف...',
                success: 'تم حذف التصنيف بنجاح!',
                error: 'لا يمكن حذف التصنيف',
            });

            setIsDeleteModalOpen(false);
            fetchCategoriesData(); // تحديث الجدول
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-banan-olive">التصنيفات الأساسية</h2>
                <button onClick={() => openAddEditModal()} className="bg-banan-olive text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-banan-olive-light transition-colors font-bold shadow-sm">
                    <Plus size={18} /> إضافة تصنيف
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
                <table className="w-full text-right text-sm">
                    {/* 🌟 تم إضافة الترويسة هنا */}
                    <thead className="bg-banan-bg text-banan-olive/70 border-b border-banan-beige/40">
                        <tr>
                            <th className="p-4 font-bold w-16 text-center">الصورة</th>
                            <th className="p-4 font-bold">اسم التصنيف</th>
                            <th className="p-4 font-bold">تاريخ الإضافة</th>
                            <th className="p-4 font-bold text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-banan-beige/40">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-banan-bg/50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded-xl bg-banan-beige/40 flex items-center justify-center text-banan-brown overflow-hidden mx-auto">
                                        {cat.imageUrl ? (
                                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={20} />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-banan-olive">{cat.name}</td>
                                <td className="p-4 text-banan-olive/70">{cat.createdAt}</td>
                                <td className="p-4 text-center space-x-2 space-x-reverse">
                                    <button onClick={() => openAddEditModal(cat)} className="p-2 text-banan-olive-light hover:bg-banan-bg rounded-lg">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => openDeleteModal(cat)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* نافذة الإضافة والتعديل */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-banan-olive/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="font-black text-lg text-banan-olive">
                                {selectedCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-rose-500 bg-gray-50 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-2">اسم التصنيف</label>
                                <input
                                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-banan-olive focus:border-transparent outline-none text-sm transition-all"
                                    placeholder="مثال: الحقائب اليدوية"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-2">صورة التصنيف</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-banan-olive cursor-pointer transition-all group overflow-hidden relative"
                                    style={{ height: '140px' }}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <UploadCloud size={32} className="mb-2 text-gray-400 group-hover:text-banan-olive transition-colors" />
                                            <span className="text-sm font-medium">اضغط لرفع صورة</span>
                                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 2MB)</span>
                                        </>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                {imagePreview && (
                                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="text-xs text-rose-500 font-bold mt-2 hover:underline">
                                        إزالة الصورة
                                    </button>
                                )}
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button type="submit" disabled={isLoading} className="flex-1 bg-banan-olive text-white py-3 rounded-xl font-bold hover:bg-banan-olive-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isLoading ? 'جاري الحفظ...' : (selectedCategory ? 'حفظ التعديلات' : 'إضافة التصنيف')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد الحذف */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-banan-olive/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-black text-xl text-gray-900 mb-2">تأكيد الحذف</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            هل أنت متأكد من حذف تصنيف <span className="font-bold text-gray-800">"{selectedCategory?.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-70">
                                إلغاء
                            </button>
                            <button onClick={confirmDelete} disabled={isLoading} className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors disabled:opacity-70">
                                {isLoading ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}