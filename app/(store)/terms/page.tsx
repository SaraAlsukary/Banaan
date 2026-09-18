import React from 'react';
import Link from 'next/link';
import { FileText, ShoppingBag, Truck, RefreshCw, ArrowRight, Video } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="bg-banan-bg min-h-screen py-10 text-right" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8 border-b border-banan-beige pb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-banan-brown font-bold text-sm hover:underline mb-4"
                    >
                        <ArrowRight size={16} />
                        العودة للرئيسية
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-banan-brown shadow-sm border border-banan-beige">
                            <FileText size={22} />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-banan-olive">الشروط والأحكام</h1>
                    </div>
                    <p className="text-gray-600 text-sm">آخر تحديث: سبتمبر 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-banan-beige space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive flex items-center gap-2">
                            <ShoppingBag size={20} className="text-banan-brown" />
                            1. الطلبات والمنتجات
                        </h2>
                        <p>
                            مرحباً بك في متجر <strong>بَنان</strong>. باستخدامك لموقعنا أو الشراء منه، فإنك توافق على الشروط والأحكام التالية:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
                            <li>جميع حقائب المشاريع اليدوية تحتوي على المستلزمات الموضحة في وصف كل منتج.</li>
                            <li>قد تختلف ألوان الخيوط أو الأدوات بشكل طفيف جداً عن الصور بسبب إضاءة التصوير أو الاختلافات بين الشاشات.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive flex items-center gap-2">
                            <Truck size={20} className="text-banan-brown" />
                            2. الأسعار والتوصيل
                        </h2>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
                            <li>الأسعار المعروضة على الموقع هي الأسعار المعتمدة للحقائب ولا تشمل أجور الشحن إلا إذا أُوضِح غير ذلك.</li>
                            <li>يستغرق شحن الطلبات وتوصيلها عادةً من 2 إلى 4 أيام عمل داخل المحافظات.</li>
                            <li>يتم الدفع عند الاستلام أو عبر وسائل الدفع المتاحة والمُتفق عليها أثناء الطلب.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive flex items-center gap-2">
                            <Video size={20} className="text-banan-brown" />
                            3. المحتوى التعليمي وحقوق الملكية
                        </h2>
                        <p>
                            تتضمن كل حقيبة كوداً مخصصاً للوصول إلى الفيديو التعليمي الخاص بالمنتج. هذا المحتوى التعليمي هو ملك حصرية لـ <strong>بَنان</strong>، ويُمنع إعادة نشره أو بيعه أو مشاركته علناً دون إذن كتابي مسبق.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive flex items-center gap-2">
                            <RefreshCw size={20} className="text-banan-brown" />
                            4. الاستبدال والإرجاع
                        </h2>
                        <p>
                            حرصاً على رضاكم، يحق للعميل طلب استبدال أو استرجاع المنتج في الحالات التالية:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
                            <li>وجود نقص في مستلزمات الحقيبة أو تلف في الأدوات عند الاستلام.</li>
                            <li>يجب الإبلاغ عن أي مشكلة خلال 48 ساعة من استلام الطلب مع إرفاق صورة توضيحية عبر الواتساب.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-banan-beige pt-6">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive">تعديل الشروط</h2>
                        <p>
                            يحتفظ متجر بَنان بالحق في تعديل هذه الشروط والأحكام في أي وقت، وتصبح التعديلات نافذة فور نشرها على هذه الصفحة.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}