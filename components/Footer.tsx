import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
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


export default function Footer() {
    return (
        <footer className="bg-banan-olive text-banan-bg pt-12 pb-6 mt-16 border-t-[6px] border-banan-brown">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-right">
                {/* معلومات المتجر */}
                <div>
                    <h3 className="text-2xl md:text-4xl font-bold mb-3">بَنان</h3>
                    <p className="text-sm opacity-80 leading-relaxed max-w-sm mx-auto md:mx-0">
                        اصنعي، استمتعي، وشاركي إبداعك.<br />
                        نوفر لك كل ما تحتاجينه لتصنعيها بيدك في حقيبة واحدة.
                    </p>
                </div>

                {/* روابط سريعة */}
                <div>
                    <h4 className="font-bold mb-3 text-lg">روابط سريعة</h4>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li><Link href="/products" className="hover:text-banan-brown transition-colors">المنتجات</Link></li>
                        <li><Link href="/categories" className="hover:text-banan-brown transition-colors">التصنيفات</Link></li>
                        <li><Link href="/about" className="hover:text-banan-brown transition-colors">من نحن</Link></li>
                        <li><Link href="/contact" className="hover:text-banan-brown transition-colors">تواصل معنا</Link></li>
                    </ul>
                </div>

                {/* معلومات التواصل */}
                <div>
                    <h4 className="font-bold mb-3 text-lg">تواصل معنا</h4>
                    <ul className="space-y-2.5 text-sm opacity-90">
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <Phone size={16} className="shrink-0" />
                            <a href="https://wa.me/963992796124" target="_blank" rel="noreferrer" className="hover:underline dir-ltr text-right">
                                0992796124
                            </a>
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} className="shrink-0" />
                            <a href="mailto:b6040339@gmail.com" className="hover:underline">
                                b6040339@gmail.com
                            </a>
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <MapPin size={16} className="shrink-0" />
                            <span>سوريا، حلب</span>
                        </li>
                    </ul>
                </div>

                {/* وسائل التواصل الاجتماعي */}
                <div>
                    <h4 className="font-bold mb-3 text-lg">تابعونا على</h4>
                    <p className="text-xs opacity-80 mb-3">تابعي أحدث حقائبنا وورش العمل على منصاتنا</p>
                    <div className="flex justify-center md:justify-start gap-3">
                        <a
                            href="https://www.instagram.com/banan.kits?igsi=MXhoNWZ6eTBpZno2dg=="
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-banan-brown transition-colors"
                            aria-label="Instagram"
                        >
                            <InstagramIcon size={18} />
                        </a>
                        <a
                            href="https://www.facebook.com/share/18prxDunBo/"
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-banan-brown transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook size={18} />
                        </a>
                        <a
                            href="https://wa.me/963992796124"
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-banan-brown transition-colors"
                            aria-label="WhatsApp"
                        >
                            <Phone size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-70 container mx-auto px-4">
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:underline">سياسة الخصوصية</Link>
                    <Link href="/terms" className="hover:underline">الشروط والأحكام</Link>
                </div>
                <div>جميع الحقوق محفوظة لمتجر بنان © {new Date().getFullYear()}</div>
            </div>
        </footer>
    );
}