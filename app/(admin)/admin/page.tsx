import StatCard from '@/components/admin/StatCard';
import Link from 'next/link';

export default function AdminOverviewPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-banan-olive">نظرة عامة</h2>
            
            {/* شبكة الإحصائيات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="إجمالي المبيعات" value="$12,450" change="+15%" positive />
                <StatCard title="الطلبات الجديدة" value="45" change="+5%" positive />
                <StatCard title="إجمالي المنتجات" value="128" change="0%" />
                <StatCard title="العملاء المسجلين" value="892" change="+12%" positive />
            </div>

            {/* أحدث الطلبات */}
            <div className="bg-white rounded-2xl border border-banan-beige shadow-sm overflow-hidden">
                <div className="p-4 border-b border-banan-beige flex justify-between items-center bg-banan-beige/20">
                    <h3 className="font-bold text-banan-olive">أحدث الطلبات</h3>
                    <Link href="/admin/orders" className="text-sm font-bold text-banan-olive-light hover:underline">
                        عرض الكل
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-banan-bg text-banan-olive/70">
                            <tr>
                                <th className="p-4 font-bold">رقم الطلب</th>
                                <th className="p-4 font-bold">العميل</th>
                                <th className="p-4 font-bold">التاريخ</th>
                                <th className="p-4 font-bold">المبلغ</th>
                                <th className="p-4 font-bold">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-banan-beige/40">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i} className="hover:bg-banan-bg/50 transition-colors">
                                    <td className="p-4 font-mono text-banan-brown font-bold">#ORD-{1000 + i}</td>
                                    <td className="p-4 font-bold text-banan-olive">محمد عبدالله</td>
                                    <td className="p-4 text-banan-olive/60">منذ ساعتين</td>
                                    <td className="p-4 font-black text-banan-olive">$45.00</td>
                                    <td className="p-4">
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                                            قيد المعالجة (Pending)
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}