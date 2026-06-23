import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import StoreHydrator from '@/components/layout/StoreHydrator';

export const metadata: Metadata = {
  title: 'LUXE — Luxury Fashion & Lifestyle',
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHydrator />
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
