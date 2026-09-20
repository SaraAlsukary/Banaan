import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { arSA } from '@clerk/localizations';
import "./globals.css";



// تعريف الخط
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
});

// تعريف الميتا داتا
export const metadata: Metadata = {
  title: "متجر بنان",
  description: "اصنعي، استمتعي، وشاركي إبداعك",
};

// مكون التخطيط الرئيسي (يجب أن يكون التصدير الافتراضي الوحيد)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={arSA}>
      <html lang="ar" dir="rtl" className={cairo.variable}>
        <body className="flex flex-col min-h-screen font-sans">

          {children}

        </body>
      </html>
    </ClerkProvider>
  );
}