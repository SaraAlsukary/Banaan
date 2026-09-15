import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-banan-olive text-banan-bg pt-12 pb-6 mt-16 border-t-[6px] border-banan-brown">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-right">
                <div>
                    <h3 className="text-2xl font-bold mb-3">بُنان</h3>
                    <p className="text-sm opacity-80 leading-relaxed max-w-sm mx-auto md:mx-0">
                        اصنعي، استمتعي، وشاركي إبداعك.<br />
                        نوفر لك كل ما تحتاجينه لتصنعيها بيدك في حقيبة واحدة.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-3 text-lg">روابط سريعة</h4>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li><Link href="/products" className="hover:text-banan-brown transition-colors">المنتجات</Link></li>
                        <li><Link href="/categories" className="hover:text-banan-brown transition-colors">التصنيفات</Link></li>
                        <li><Link href="/about" className="hover:text-banan-brown transition-colors">من نحن</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-3 text-lg">تواصل معنا</h4>
                    <p className="text-sm opacity-80 mb-2">البريد: info@banan.shop</p>
                    <p className="text-sm opacity-80">الهاتف: +966 50 000 0000</p>
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