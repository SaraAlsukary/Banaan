import "../globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import FloatingButtons from "@/components/FloatingButtons";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext"; // سياق المفضلة
import CartSidebar from "@/components/SideCart";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <CartProvider>
      <WishlistProvider>
        <Header />

        {/* محتوى الصفحات الفرعية */}
        <PageTransition>
          {children}
        </PageTransition>

        <FloatingButtons />
        <CartSidebar />
        <Footer />
      </WishlistProvider>
    </CartProvider>

  );
}