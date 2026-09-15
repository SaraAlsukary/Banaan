"use client";

import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Tags, 
    Layers, 
    Users, 
    ShoppingCart, 
    Search, 
    Bell, 
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Image as ImageIcon
} from 'lucide-react';

export default function AdminDashboard() {
    // حالة التحكم بالصفحة المعروضة حالياً
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="flex h-screen bg-gray-50 font-sans" dir="rtl">
            
            {/* القائمة الجانبية (Sidebar) */}
            <aside className="w-64 bg-white border-l border-gray-200 flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-gray-200">
                    <h1 className="text-2xl font-black text-indigo-600">لوحة الإدارة</h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20}/>} text="نظرة عامة" />
                    <SidebarItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingCart size={20}/>} text="الطلبات" />
                    <SidebarItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<ShoppingBag size={20}/>} text="المنتجات" />
                    <SidebarItem active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Tags size={20}/>} text="التصنيفات" />
                    <SidebarItem active={activeTab === 'subcategories'} onClick={() => setActiveTab('subcategories')} icon={<Layers size={20}/>} text="التصنيفات الفرعية" />
                    <SidebarItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={20}/>} text="المستخدمين" />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            أ.م
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">أدمن المتجر</p>
                            <p className="text-xs text-gray-500">admin@store.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* القسم الرئيسي */}
            <main className="flex-1 flex flex-col overflow-hidden">
                
                {/* الشريط العلوي (Topbar) */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="relative w-96">
                        <input 
                            type="text" 
                            placeholder="ابحث عن طلب، منتج، أو مستخدم..." 
                            className="w-full bg-gray-100 border-none rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </header>

                {/* محتوى الصفحة المتغير */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && <OverviewView />}
                    {activeTab === 'products' && <ProductsView />}
                    {activeTab === 'orders' && <OrdersView />}
                    {activeTab === 'categories' && <CategoriesView />}
                    {activeTab === 'users' && <UsersView />}
                    {/* يمكنك إضافة البقية بنفس النمط */}
                </div>
            </main>
        </div>
    );
}

// ==========================================
// مكونات الصفحات الفرعية
// ==========================================

// 1. نظرة عامة (Overview)
function OverviewView() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">نظرة عامة</h2>
            
            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="إجمالي المبيعات" value="$12,450" change="+15%" positive />
                <StatCard title="الطلبات الجديدة" value="45" change="+5%" positive />
                <StatCard title="إجمالي المنتجات" value="128" change="0%" />
                <StatCard title="العملاء المسجلين" value="892" change="+12%" positive />
            </div>

            {/* أحدث الطلبات */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">أحدث الطلبات</h3>
                    <button className="text-sm text-indigo-600 hover:underline">عرض الكل</button>
                </div>
                <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-4 font-medium">رقم الطلب</th>
                            <th className="p-4 font-medium">العميل</th>
                            <th className="p-4 font-medium">التاريخ</th>
                            <th className="p-4 font-medium">المبلغ</th>
                            <th className="p-4 font-medium">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[1, 2, 3, 4].map(i => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-600">#ORD-{1000+i}</td>
                                <td className="p-4 font-bold text-gray-800">محمد عبدالله</td>
                                <td className="p-4 text-gray-500">منذ ساعتين</td>
                                <td className="p-4 font-bold text-green-600">$45.00</td>
                                <td className="p-4">
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">قيد المعالجة (Pending)</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// 2. إدارة المنتجات (Products)
function ProductsView() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={18} /> إضافة منتج جديد
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-4 font-medium w-16">الصورة</th>
                            <th className="p-4 font-medium">اسم المنتج</th>
                            <th className="p-4 font-medium">السعر</th>
                            <th className="p-4 font-medium">التصنيف</th>
                            <th className="p-4 font-medium text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[1, 2, 3].map(i => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                                        <ImageIcon size={20} />
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-gray-800">حقيبة تطريز لافندر</td>
                                <td className="p-4 text-gray-600">$15.99</td>
                                <td className="p-4 text-gray-500">التطريز</td>
                                <td className="p-4 text-center space-x-2 space-x-reverse">
                                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                                    <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// 3. إدارة التصنيفات (Categories)
function CategoriesView() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">التصنيفات الرئيسية</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={18} /> إضافة تصنيف
                </button>
            </div>
            {/* يمكنك تكرار نفس نمط جدول المنتجات هنا */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                جدول التصنيفات يظهر هنا
            </div>
        </div>
    );
}

// 4. الطلبات (Orders)
function OrdersView() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">سجل الطلبات</h2>
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                قائمة الطلبات تظهر هنا مع فلاتر للحالة (Pending, Completed, Cancelled)
            </div>
        </div>
    );
}

// 5. المستخدمين (Users)
function UsersView() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">قائمة المستخدمين</h2>
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                قائمة العملاء (Clerk Users) تظهر هنا
            </div>
        </div>
    );
}

// ==========================================
// مكونات مساعدة (UI Components)
// ==========================================

function SidebarItem({ icon, text, active, onClick }: { icon: React.ReactNode, text: string, active?: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-bold ${
                active 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}

function StatCard({ title, value, change, positive }: { title: string, value: string, change: string, positive?: boolean }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <h4 className="text-gray-500 text-sm mb-2">{title}</h4>
            <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-gray-800">{value}</span>
                {change !== "0%" && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}