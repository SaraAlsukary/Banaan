"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    Sparkles, 
    Heart, 
    Target, 
    Users, 
    Smile, 
    ArrowLeft, 
    CheckCircle2, 
    PackageCheck,
    Video
} from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: <PackageCheck className="text-banan-brown" size={28} />,
            title: "حقائب متكاملة 100%",
            description: "نوفر لك كل إبرة، خيط، وإطار تحتاجه في حقيبة واحدة لتستمتع بالعمل فوراً دون الحاجة للبحث عن المستلزمات."
        },
        {
            icon: <Video className="text-banan-brown" size={28} />,
            title: "تعليم مبسط وواضح",
            description: "شروحات فيديو تفصيلية خطوة بخطوة مصممة لتأخذ بيدك من مستوى المبتدئ وحتى إتقان القطعة بالكامل."
        },
        {
            icon: <Heart className="text-banan-brown" size={28} />,
            title: "شغف بالصناعة اليدوية",
            description: "نختار خاماتنا بعناية فائقة ونراعي أدق التفاصيل لنضمن لك تجربة صنع مريحة وممتعة للروح."
        },
        {
            icon: <Users className="text-banan-brown" size={28} />,
            title: "مجتمع متنامي",
            description: "نسعى لبناء مجتمع يجمع الهواة والمبدعين لمشاركة إنجازاتهم وتبادل الإلهام بشكل مستمر."
        }
    ];

    // const stats = [
    //     { number: "+1,500", label: "عميلة سعيدة" },
    //     { number: "+2,000", label: "حقيبة مشروع مُسلمة" },
    //     { number: "+15", label: "تنسيقة ومجال حرفي" },
    //     { number: "100%", label: "حب وإتقان" }
    // ];

    return (
        <div className="bg-banan-bg min-h-screen py-10" dir="rtl">
            {/* 1. Hero Section */}
            <section className="container mx-auto px-4 mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-banan-beige/80 text-banan-brown px-5 py-2 rounded-full text-sm font-bold mb-6 shadow-sm"
                >
                    <Sparkles size={18} />
                    <span>تعرّفي على عالم بنان</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black text-banan-olive mb-6 leading-tight max-w-3xl mx-auto"
                >
                    نحوّل وقت فراغك إلى لحظات إبداع قطع تصنعينها بيدك.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
                >
                    في **بنان**، نؤمن أن الأشياء المصنوعة بحب لها قيمة لا تُقدّر. هدفنا تسهيل بداية رحلتك في الحرف اليدوية دون عناء البحث عن الخامات أو التعقيد.
                </motion.p>
            </section>

            {/* 2. Story Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-banan-beige/60 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <span className="text-banan-brown font-bold text-sm tracking-wide">قصتنا</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-banan-olive">
                            كيف بدأت رحلة "بنان"؟
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                            بدأت فكرة متجر بنان من شغف بسيط بالأعمال اليدوية وملاحظة عقبة تكررت دائماً: التشتت بين شراء أدوات التطريز، الخيوط، والخامات من أماكن مختلفة، ومحاولة البحث عن دروس مناسبة للمبتدئين.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                            من هنا ولدت فكرة **"حقيبة المشروع المتكاملة"**؛ جمعنا فيها أفضل الخامات، الألوان المتناسقة، مع فيديو تعليمي يحاكي وجود معلّم بجانبك، لترتبي مساحتك وتستمتعي بالصناعة مباشرة.
                        </p>
                        
                        <div className="pt-2">
                            <div className="flex items-center gap-3 text-banan-olive font-bold mb-2">
                                <CheckCircle2 className="text-banan-brown" size={20} />
                                <span>خامات مختارة بعناية جودة فائقة</span>
                            </div>
                            <div className="flex items-center gap-3 text-banan-olive font-bold">
                                <CheckCircle2 className="text-banan-brown" size={20} />
                                <span>فيديوهات تعليمية مخصصة لكل حقيبة</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[350px] md:h-[420px] rounded-2xl overflow-hidden shadow-md border-4 border-banan-beige"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1620162589998-90b9b39cc598?w=800&q=80"
                            alt="عمل يدي تطريز بنان"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* 3. Values Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-banan-olive mb-3">
                        لماذا تختارين حقائب بنان؟
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base max-w-lg mx-auto">
                        قيم نسير عليها في كل حقيبة تجهز ونشحنها إليك
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-banan-beige flex flex-col items-start space-y-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-banan-bg flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-banan-olive">{item.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. Stats Section */}
            {/* <section className="container mx-auto px-4 mb-20">
                <div className="bg-banan-olive rounded-3xl p-8 md:p-12 text-white shadow-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <span className="text-3xl md:text-5xl font-black text-banan-beige block font-mono">
                                    {stat.number}
                                </span>
                                <span className="text-sm md:text-base text-gray-200 font-medium">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* 5. CTA Section */}
            <section className="container mx-auto px-4 mb-12 text-center">
                <div className="bg-banan-beige/50 rounded-3xl p-8 md:p-12 border border-banan-beige max-w-4xl mx-auto space-y-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-banan-olive">
                        جاهزة لتبدئي مشروعك اليدوي الأول؟
                    </h2>
                    <p className="text-gray-700 max-w-xl mx-auto text-base md:text-lg">
                        استكشفي مجموعتنا المتنوعة من حقائب الكروشيه، التطريز، التلبيد، وغيرها وابدأي بصنع قطعتك الفنية الخاصة اليوم.
                    </p>
                    <div className="pt-2 flex justify-center">
                        <Link
                            href="/products"
                            className="bg-banan-olive-light text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-banan-olive hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            استكشفي المشاريع الآن <ArrowLeft size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}