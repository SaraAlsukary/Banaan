"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    CheckCircle2,
    ChevronDown,
    HeartHandshake,
} from 'lucide-react';
import { sendContactEmail } from '../../actions/contact'; // استدعاء دالة الإرسال

function Instagram({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}


function Facebook({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}


export default function page() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        // 1. تحويل بيانات الـ State إلى FormData
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('phone', formData.phone);
        payload.append('subject', formData.subject);
        payload.append('message', formData.message);

        try {
            // 2. استدعاء الـ Server Action
            const result = await sendContactEmail(payload);

            if (result.success) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                setErrorMessage('حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.');
            }
        } catch (error) {
            setErrorMessage('فشل الاتصال بالخادم، يرجى التحقق من الاتصال.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactCards = [
        {
            icon: <Phone size={24} className="text-banan-brown" />,
            title: "الهاتف والواتساب",
            detail: "0992796124",
            link: "https://wa.me/963992796124",
            action: "تحدث معنا عبر الواتساب"
        },
        {
            icon: <Mail size={24} className="text-banan-brown" />,
            title: "البريد الإلكتروني",
            detail: "b6040339@gmail.com",
            link: "mailto:b6040339@gmail.com",
            action: "أرسل بريداً إلكترونياً"
        },
        {
            icon: <Instagram size={24} />,
            title: "إنستغرام",
            detail: "@banan.kits",
            link: "https://www.instagram.com/banan.kits?igsi=MXhoNWZ6eTBpZno2dg==",
            action: "تابعنا على إنستغرام"
        },
        {
            icon: <Facebook size={24} />,
            title: "فيسبوك",
            detail: "صفحتنا على فيسبوك",
            link: "https://www.facebook.com/share/18prxDunBo/",
            action: "تابعنا على فيسبوك"
        },
        {
            icon: <MapPin size={24} />,
            title: "الموقع الرئيسي",
            detail: "سوريا، حلب",
            link: "#",
            action: "العنوان الرئيسي"
        }
    ];

    const faqs = [
        {
            q: "ماذا تحتوي حقائب بنان للمشاريع اليدوية؟",
            a: "تحتوي كل حقيبة على جميع المستلزمات والأدوات الأساسية (الخيوط، الإبر، الخامات) بالإضافة إلى كود خاص لمشاهدة فيديو تعليمي خطوة بخطوة."
        },
        {
            q: "كم يستغرق توصيل الطلب؟",
            a: "يستغرق التوصيل عادةً من 2 إلى 4 أيام عمل داخل كافة المحافظات."
        },
        {
            q: "هل حقائب المشاريع مناسبة للمبتدئين؟",
            a: "نعم تماماً! صممت جميع حقائبنا لتكون مناسبة لمن يبدأ من الصفر، والشروحات مصممة بأسلوب مبسط جداً."
        }
    ];

    return (
        <div className="bg-banan-bg min-h-screen py-10" dir="rtl">
            <section className="container mx-auto px-4 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-banan-beige/80 text-banan-brown px-5 py-2 rounded-full text-sm font-bold mb-6 shadow-sm"
                >
                    <HeartHandshake size={18} />
                    <span>يسعدنا تواصلك دائماً</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black text-banan-olive mb-4"
                >
                    نحن هنا لمساعدتك في كل خطوة
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-700 text-lg max-w-xl mx-auto font-medium"
                >
                    لديك استفسار حول حقيبة معينة، طلب خاص، أو تحتاج مساعدة في مشروعك؟ أرسل لنا رسالة وسنرد عليك بأسرع وقت!
                </motion.p>
            </section>

            <section className="container mx-auto px-4 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-banan-beige"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-banan-bg flex items-center justify-center text-banan-brown">
                                <MessageSquare size={22} />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-banan-olive">أرسلي لنا رسالة</h2>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-semibold">
                                {errorMessage}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {isSubmitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 my-6"
                                >
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={36} />
                                    </div>
                                    <h3 className="text-xl font-bold text-emerald-800">تم إرسال رسالتك بنجاح!</h3>
                                    <p className="text-emerald-700 text-sm max-w-md mx-auto">
                                        شكراً لتواصلك معنا. سنقوم بمراجعة رسالتك والرد عليك عبر البريد الإلكتروني أو الواتساب في أقرب وقت.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition-colors pt-2"
                                    >
                                        إرسال رسالة أخرى
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-banan-olive mb-1">الاسم الكامل *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="أدخلي اسمك الكريم"
                                                className="w-full px-4 py-3 rounded-2xl bg-banan-bg/40 border border-banan-beige focus:outline-none focus:border-banan-brown transition-colors text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-banan-olive mb-1">البريد الإلكتروني *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="example@domain.com"
                                                className="w-full px-4 py-3 rounded-2xl bg-banan-bg/40 border border-banan-beige focus:outline-none focus:border-banan-brown transition-colors text-sm dir-ltr text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-banan-olive mb-1">رقم الهاتف / الواتساب</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+963..."
                                                className="w-full px-4 py-3 rounded-2xl bg-banan-bg/40 border border-banan-beige focus:outline-none focus:border-banan-brown transition-colors text-sm dir-ltr text-right"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-banan-olive mb-1">موضوع الرسالة *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="استفسار، طلب خاص، إلخ..."
                                                className="w-full px-4 py-3 rounded-2xl bg-banan-bg/40 border border-banan-beige focus:outline-none focus:border-banan-brown transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-banan-olive mb-1">نص الرسالة *</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="اكتبي تفاصيل استفسارك هنا..."
                                            className="w-full px-4 py-3 rounded-2xl bg-banan-bg/40 border border-banan-beige focus:outline-none focus:border-banan-brown transition-colors text-sm resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-banan-olive-light text-white py-4 rounded-2xl font-bold shadow-md hover:bg-banan-olive transition-all flex items-center justify-center gap-2 text-base disabled:opacity-70 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <span>جاري الإرسال...</span>
                                        ) : (
                                            <>
                                                <span>إرسال الرسالة</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {contactCards.map((card, idx) => (
                                <a
                                    key={idx}
                                    href={card.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white rounded-2xl p-5 border border-banan-beige flex items-center gap-4 hover:shadow-md transition-shadow group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-banan-bg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-banan-olive text-sm">{card.title}</h4>
                                        <p className="text-sm font-semibold text-gray-800 my-0.5">{card.detail}</p>
                                        <span className="text-xs text-banan-brown font-bold group-hover:underline">
                                            {card.action} ←
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="bg-banan-beige/40 rounded-2xl p-6 border border-banan-beige flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-banan-brown shrink-0 shadow-sm">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-banan-olive text-sm mb-1">ساعات العمل والدعم</h4>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    فريق خدمة العملاء متواجد للرد على جميع استفساراتكم من:
                                    <br />
                                    <strong className="text-banan-olive font-bold">السبت إلى الخميس: 9:00 صباحاً - 6:00 مساءً</strong>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-8">
                    <span className="text-banan-brown font-bold text-xs uppercase tracking-wider">قبل أن ترسل رسالة</span>
                    <h3 className="text-2xl font-bold text-banan-olive mt-1">الأسئلة الأكثر تكراراً</h3>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-banan-beige overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full px-6 py-4 text-right font-bold text-banan-olive flex justify-between items-center text-sm md:text-base"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-200 text-banan-brown ${openFaq === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50"
                                    >
                                        <div className="pt-2">{faq.a}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}