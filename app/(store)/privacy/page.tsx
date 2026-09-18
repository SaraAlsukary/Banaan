import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Mail, Phone, ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
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
                            <ShieldCheck size={22} />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-banan-olive">سياسة الخصوصية</h1>
                    </div>
                    <p className="text-gray-600 text-sm">آخر تحديث: سبتمبر 2026</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-banan-beige space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive flex items-center gap-2">
                            <Eye size={20} className="text-banan-brown" />
                            1. المعلومات التي نجمعها
                        </h2>
                        <p>
                            نحن في متجر <strong>بَنان</strong> نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. نجمع البيانات الضرورية فقط لإتمام طلباتك وتوفير أفضل تجربة تسوق:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
                            <li>الاسم الكامل.</li>
                            <li>معلومات التواصل (رقم الهاتف / الواتساب، البريد الإلكتروني).</li>
                            <li>عنوان التوصيل (المحافظة، المدينة، التفاصيل).</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive flex items-center gap-2">
                            <Lock size={20} className="text-banan-brown" />
                            2. كيف نستخدم معلوماتك؟
                        </h2>
                        <p>تُستخدم المعلومات التي نجمعها للأغراض التالية فقط:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pr-2">
                            <li>تجهيز وشحن طلبات حقائب المشاريع اليدوية والتواصل معك لتأكيد التسليم.</li>
                            <li>الرد على استفساراتك عبر البريد الإلكتروني أو الواتساب.</li>
                            <li>تحسين جودة منتجاتنا وخدماتنا بناءً على ملاحظاتك.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive">3. حماية البيانات ومشاركتها</h2>
                        <p>
                            نلتزم بعدم بيع، تأجير، أو مشاركة بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية. يتم مشاركة معلومات العنوان ورقم الهاتف فقط مع شركات التوصيل المعتمدة لدينا لضمان وصول طلبك.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive">4. ملفات تعريف الارتباط (Cookies)</h2>
                        <p>
                            يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح وحفظ محتويات سلة التسوق الخاصة بك أثناء التصفح.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-banan-beige pt-6">
                        <h2 className="text-lg md:text-xl font-bold text-banan-olive">تواصل معنا</h2>
                        <p>إذا كان لديك أي استفسار حول سياسة الخصوصية، يمكنك التواصل معنا عبر:</p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <a href="mailto:b6040339@gmail.com" className="flex items-center gap-2 text-banan-brown font-bold hover:underline">
                                <Mail size={18} />
                                b6040339@gmail.com
                            </a>
                            <a href="https://wa.me/963992796124" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-banan-brown font-bold hover:underline">
                                <Phone size={18} />
                                0992796124 (واتساب)
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}