import { Nav } from "@/components/Nav";
import { CartProvider } from "@/contexts/CartContext";
import { Review } from '@/components/Review'
import { World } from "@/components/World";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <Nav />
      {children}
      <World />
      <Review />
      <Footer />
    </CartProvider>
  );
}