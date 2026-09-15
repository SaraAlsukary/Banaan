import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { ClerkProvider } from "@clerk/nextjs";

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
          <Header />

          <PageTransition>
            {children}
          </PageTransition>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}