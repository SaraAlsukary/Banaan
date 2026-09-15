"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import Image from 'next/image';
import { getProducts, saveProduct, deleteProduct } from '../../../actions/products'; // تأكد من مسار الـ actions الصحيح
import { getSubcategories } from '../../../actions/subcategories'; // لجلب التصنيفات الفرعية في النموذج

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // حالة النافذة المنبثقة (Modal)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    // حقول النموذج
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
    
    // الصور
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    
    const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
    
    const [submitting, setSubmitting] = useState(false);

    // جلب البيانات عند تحميل الصفحة
    const loadData = async () => {
        try {
            setLoading(true);
            const prods = await getProducts();
            const subcats = await getSubcategories();
            setProducts(prods);
            setSubcategories(subcats);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // فتح النافذة للإضافة أو التعديل
    const handleOpenModal = (product?: any) => {
        if (product) {
            setEditingProduct(product);
            setName(product.name);
            setPrice(product.price);
            setShortDescription(product.shortDescription || '');
            setLongDescription(product.longDescription || '');
            // استخراج معرفات التصنيفات المرتبطة
            setSelectedSubcategories(product.subcategories?.map((s: any) => s.subcategoryId) || []);
            setMainImagePreview(product.imageUrl);
        } else {
            setEditingProduct(null);
            setName('');
            setPrice('');
            setShortDescription('');
            setLongDescription('');
            setSelectedSubcategories([]);
            setMainImagePreview(null);
        }
        setMainImageFile(null);
        setExtraImageFiles([]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    // حفظ المنتج (إضافة أو تعديل)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("shortDescription", shortDescription);
        formData.append("longDescription", longDescription);

        // إرسال التصنيفات الفرعية المتعددة
        selectedSubcategories.forEach(subId => {
            formData.append("subcategories", subId.toString());
        });

        // الصورة الرئيسية
        if (mainImageFile) {
            formData.append("mainImage", mainImageFile);
        }

        // الصور الإضافية
        extraImageFiles.forEach(file => {
            formData.append("extraImages", file);
        });

        const res = await saveProduct(formData, editingProduct?.id);

        setSubmitting(false);
        if (res.success) {
            loadData();
            handleCloseModal();
        } else {
            alert(res.error || "حدث خطأ ما");
        }
    };

    // حذف المنتج
    const handleDelete = async (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
            const res = await deleteProduct(id);
            if (res.success) {
                loadData();
            } else {
                alert(res.error);
            }
        }
    };

    // التحكم في اختيار التصنيفات الفرعية (Checkbox)
    const handleCheckboxChange = (subId: number) => {
        if (selectedSubcategories.includes(subId)) {
            setSelectedSubcategories(selectedSubcategories.filter(id => id !== subId));
        } else {
            setSelectedSubcategories([...selectedSubcategories, subId]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-banan-olive">إدارة المنتجات</h2>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-banan-olive text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-banan-olive-light transition-colors font-bold shadow-sm"
                >
                    <Plus size={18} /> إضافة منتج جديد
                </button>
            </div>

            {/* جدول المنتجات */}
            <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-banan-bg text-banan-olive/70">
                        <tr>
                            <th className="p-4 font-bold w-16">الصورة</th>
                            <th className="p-4 font-bold">اسم المنتج</th>
                            <th className="p-4 font-bold">السعر</th>
                            <th className="p-4 font-bold">التصنيفات</th>
                            <th className="p-4 font-bold text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-banan-beige/40">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-banan-olive/60">جاري التحميل...</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-banan-olive/60">لا توجد منتجات مضافة حالياً</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-banan-bg/50 transition-colors">
                                    <td className="p-4">
                                        <div className="w-10 h-10 rounded-xl bg-banan-beige/40 overflow-hidden flex items-center justify-center text-banan-brown border border-banan-beige relative">
                                            {product.imageUrl ? (
                                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <ImageIcon size={20} />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-banan-olive">{product.name}</td>
                                    <td className="p-4 font-mono font-bold text-banan-olive">${product.price}</td>
                                    <td className="p-4 text-banan-olive/70 font-medium">{product.categoriesNames || "بدون تصنيف"}</td>
                                    <td className="p-4 text-center space-x-2 space-x-reverse">
                                        <button 
                                            onClick={() => handleOpenModal(product)}
                                            className="p-2 text-banan-olive-light hover:bg-banan-bg rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* نافذة الإضافة والتعديل المنبثقة (Modal) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl border border-banan-beige my-8">
                        <div className="flex justify-between items-center p-6 bg-banan-bg border-b border-banan-beige">
                            <h3 className="text-lg font-bold text-banan-olive">
                                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-banan-olive/60 hover:text-banan-olive">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            {/* اسم المنتج والسعر */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-banan-olive mb-1">اسم المنتج</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-banan-beige focus:outline-none focus:ring-2 focus:ring-banan-olive/20"
                                        placeholder="أدخل اسم المنتج"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-banan-olive mb-1">السعر ($)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        required
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-banan-beige focus:outline-none focus:ring-2 focus:ring-banan-olive/20"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* الوصف القصير */}
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-1">وصف قصير</label>
                                <input 
                                    type="text" 
                                    value={shortDescription} 
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-banan-beige focus:outline-none focus:ring-2 focus:ring-banan-olive/20"
                                    placeholder="نبذة مختصرة عن المنتج"
                                />
                            </div>

                            {/* الوصف التفصيلي */}
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-1">وصف تفصيلي</label>
                                <textarea 
                                    rows={3}
                                    value={longDescription} 
                                    onChange={(e) => setLongDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-banan-beige focus:outline-none focus:ring-2 focus:ring-banan-olive/20"
                                    placeholder="التفاصيل الكاملة..."
                                ></textarea>
                            </div>

                            {/* التصنيفات الفرعية (Checkboxes) */}
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-2">التصنيفات الفرعية</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-banan-beige rounded-xl bg-banan-bg/30">
                                    {subcategories.map((sub) => (
                                        <label key={sub.id} className="flex items-center gap-2 text-sm text-banan-olive cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedSubcategories.includes(sub.id)}
                                                onChange={() => handleCheckboxChange(sub.id)}
                                                className="rounded border-banan-beige text-banan-olive focus:ring-banan-olive"
                                            />
                                            {sub.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* الصورة الرئيسية */}
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-1">الصورة الرئيسية</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer border-2 border-dashed border-banan-beige hover:border-banan-olive/50 rounded-xl p-4 flex flex-col items-center justify-center text-banan-olive/60 transition-colors">
                                        <Upload size={24} className="mb-1" />
                                        <span className="text-xs font-bold">اختر الصورة الرئيسية</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setMainImageFile(e.target.files[0]);
                                                    setMainImagePreview(URL.createObjectURL(e.target.files[0]));
                                                }
                                            }}
                                        />
                                    </label>
                                    {mainImagePreview && (
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-banan-beige">
                                            <Image src={mainImagePreview} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* الصور الإضافية */}
                            <div>
                                <label className="block text-sm font-bold text-banan-olive mb-1">صور إضافية للمعرض</label>
                                <input 
                                    type="file" 
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setExtraImageFiles(Array.from(e.target.files));
                                        }
                                    }}
                                    className="w-full text-sm text-banan-olive/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-banan-bg file:text-banan-olive hover:file:bg-banan-beige/50"
                                />
                                {extraImageFiles.length > 0 && (
                                    <p className="text-xs text-banan-olive/60 mt-1">تم اختيار {extraImageFiles.length} صور إضافية</p>
                                )}
                            </div>

                            {/* أزرار الحفظ والإلغاء */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-banan-beige">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-xl border border-banan-beige text-banan-olive font-bold hover:bg-banan-bg transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-5 py-2.5 rounded-xl bg-banan-olive text-white font-bold hover:bg-banan-olive-light transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "جاري الحفظ..." : "حفظ المنتج"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}