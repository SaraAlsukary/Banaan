"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, AlertTriangle, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

// 💡 قم بفك التعليق عند توفر الأكشن
import { getSubcategories, deleteSubcategory, saveSubcategory } from '@/app/actions/subcategories';
import { getCategories } from '@/app/actions/categories';

interface Subcategory {
    id: number;
    categoryId: number;
    categoryName: string;
    name: string;
    imageUrl: string | null;
    createdAt: string;
}

export default function SubcategoriesPage() {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [mainCategories, setMainCategories] = useState<{ id: number, name: string }[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // جلب البيانات
    const fetchData = async () => {
        const categoriesData = await getCategories();
        setMainCategories(categoriesData);
        const subcategoriesData = await getSubcategories();
        setSubcategories(subcategoriesData as any);

        // بيانات وهمية مؤقتة
        // setMainCategories([
        //     // { id: 1, name: 'التطريز اليدوي' }, { id: 2, name: 'الحقائب' }

        // ]);
        // setSubcategories([
        //     // { id: 1, categoryId: 1, categoryName: 'التطريز اليدوي', name: 'أطواق تطريز', imageUrl: null, createdAt: '2023-10-05' },
        // ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // تحديد حالة (تعديل أم إضافة) وتعبئة الحقول
    const openAddEditModal = (sub?: Subcategory) => {
        if (sub) {
            setSelectedSubcategory(sub);
            setName(sub.name);
            setCategoryId(sub.categoryId.toString());
            setImagePreview(sub.imageUrl || null);
            setImageFile(null);
        } else {
            setSelectedSubcategory(null);
            setName('');
            setCategoryId('');
            setImagePreview(null);
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const openDeleteModal = (sub: Subcategory) => {
        setSelectedSubcategory(sub);
        setIsDeleteModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // إرسال البيانات (Add & Edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("categoryId", categoryId);
        if (imageFile) formData.append("image", imageFile);

        try {
            // محاكاة الأكشن
            // const actionPromise = new Promise((resolve) => setTimeout(resolve, 1000));

            // 💡 الكود الحقيقي:
            let actionPromise;
            if (selectedSubcategory) {
                // تعديل
                actionPromise = saveSubcategory(formData, selectedSubcategory.id);
            } else {
                // إضافة جديدة
                actionPromise = saveSubcategory(formData);
            }

            await toast.promise(actionPromise, {
                loading: selectedSubcategory ? 'جاري تحديث التصنيف الفرعي...' : 'جاري إضافة التصنيف الفرعي...',
                success: selectedSubcategory ? 'تم التعديل بنجاح!' : 'تمت الإضافة بنجاح!',
                error: 'حدث خطأ غير متوقع',
            });

            setIsModalOpen(false);
            fetchData(); // تحديث الجدول مباشرة بعد الحفظ
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // تأكيد الحذف
    const confirmDelete = async () => {
        if (!selectedSubcategory) return;
        setIsLoading(true);

        try {
            // 💡 الكود الحقيقي:
            const deletePromise = deleteSubcategory(selectedSubcategory.id);
            // const deletePromise = new Promise((resolve) => setTimeout(resolve, 1000));

            await toast.promise(deletePromise, {
                loading: 'جاري الحذف...',
                success: 'تم الحذف بنجاح!',
                error: 'حدث خطأ أثناء الحذف',
            });

            setIsDeleteModalOpen(false);
            fetchData(); // تحديث الجدول بعد الحذف
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-banan-olive">التصنيفات الفرعية</h2>
                <button onClick={() => openAddEditModal()} className="bg-banan-olive text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-banan-olive-light transition-colors font-bold shadow-sm">
                    <Plus size={18} /> إضافة تصنيف فرعي
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
                <table className="w-full text-right text-sm">
                    {/* 🌟 ترويسة الجدول للتصنيفات الفرعية */}
                    <thead className="bg-banan-bg text-banan-olive/70 border-b border-banan-beige/40">
                        <tr>
                            <th className="p-4 font-bold w-16 text-center">الصورة</th>
                            <th className="p-4 font-bold">الاسم الفرعي</th>
                            <th className="p-4 font-bold">التصنيف الأساسي</th>
                            <th className="p-4 font-bold">تاريخ الإضافة</th>
                            <th className="p-4 font-bold text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-banan-beige/40">
                        {subcategories.map((sub) => (
                            <tr key={sub.id} className="hover:bg-banan-bg/50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded-xl bg-banan-beige/40 flex items-center justify-center text-banan-brown overflow-hidden mx-auto">
                                        {sub.imageUrl ? (
                                            <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                                        ) : <ImageIcon size={20} />}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-banan-olive">{sub.name}</td>
                                <td className="p-4 text-banan-olive/70">
                                    <span className="bg-banan-beige/50 px-3 py-1 rounded-lg text-xs font-bold text-banan-olive">{sub.categoryName}</span>
                                </td>
                                <td className="p-4 text-banan-olive/70">{sub.createdAt}</td>
                                <td className="p-4 text-center space-x-2 space-x-reverse">
                                    <button onClick={() => openAddEditModal(sub)} className="p-2 text-banan-olive-light hover:bg-banan-bg rounded-lg">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => openDeleteModal(sub)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
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
                                {selectedSubcategory ? 'تعديل التصنيف الفرعي' : 'إضافة تصنيف فرعي جديد'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-rose-500 bg-gray-50 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-2">اسم التصنيف الفرعي</label>
                                <input
                                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-banan-olive outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-2">التصنيف الأساسي التابع له</label>
                                <select
                                    required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-banan-olive outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>اختر التصنيف الأساسي...</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-2">صورة التصنيف</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group hover:bg-gray-50 hover:border-banan-olive transition-all"
                                    style={{ height: '140px' }}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500 group-hover:text-banan-olive">
                                            <UploadCloud size={32} className="mb-2" />
                                            <span className="text-sm font-medium">اضغط لرفع صورة</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                {imagePreview && (
                                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="text-xs text-rose-500 font-bold mt-2 hover:underline">
                                        إزالة الصورة
                                    </button>
                                )}
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full bg-banan-olive text-white py-3 rounded-xl font-bold hover:bg-banan-olive-light disabled:opacity-70 transition-colors">
                                {isLoading ? 'جاري الحفظ...' : (selectedSubcategory ? 'حفظ التعديلات' : 'إضافة التصنيف')}
                            </button>
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
                            هل أنت متأكد من حذف <span className="font-bold">"{selectedSubcategory?.name}"</span>؟
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                إلغاء
                            </button>
                            <button onClick={confirmDelete} disabled={isLoading} className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors">
                                {isLoading ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}