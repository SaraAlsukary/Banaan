import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../../globals.css";
import AdminHeader from "@/components/admin/AdminHeader";
import Sidebar from "@/components/admin/Sidebar";
const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-arabic", // ربط الخط مع متغير Tailwind
});

export const metadata: Metadata = {
    title: "متجر بنان",
    description: "اصنعي، استمتعي، وشاركي إبداعك",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>

            <html lang="ar" dir="rtl" className={cairo.variable}>
                <body className="flex flex-col min-h-screen">

                    <div className="flex h-screen bg-banan-bg text-banan-olive font-sans overflow-hidden" dir="rtl">
                        {/* القائمة الجانبية */}
                        <Sidebar />

                        {/* الحاوية الرئيسية للمحتوى والهيدر */}
                        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                            <AdminHeader />
                            <main className="flex-1 overflow-y-auto p-6">
                                {children}
                            </main>
                        </div>
                    </div>

                </body>
            </html>
        </ClerkProvider>
    );
}