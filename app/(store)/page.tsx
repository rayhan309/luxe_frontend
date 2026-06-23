import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import { FeaturedProducts, BestSellers, NewArrivals } from '@/components/home/FeaturedProducts';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import PromoBanner from '@/components/home/PromoBanner';
import Testimonials from '@/components/home/Testimonials';
import InstagramGallery from '@/components/home/InstagramGallery';
import Newsletter from '@/components/home/Newsletter';

export const metadata: Metadata = {
  title: 'LUXE — Luxury Fashion & Lifestyle',
  description:
    'Discover curated luxury fashion, accessories and lifestyle products at LUXE. Premium quality, timeless design.',
};

export default function HomePage() {
  return (
    <div style={{ paddingTop: 0 }}>
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <NewArrivals />
      <BestSellers />
      <PromoBanner />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </div>
  );
}
