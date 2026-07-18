import { Hero } from '@/features/home/components/Hero';
import { CategoryGrid } from '@/features/home/components/CategoryGrid';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';
import { NewArrivals } from '@/features/home/components/NewArrivals';
import { BestSellers } from '@/features/home/components/BestSellers';
import { QuickDeals } from '@/features/home/components/QuickDeals';
import { BrandStrip } from '@/features/home/components/BrandStrip';
import { TrustBadges } from '@/features/home/components/TrustBadges';
import { Testimonials } from '@/features/home/components/Testimonials';
import { Newsletter } from '@/features/home/components/Newsletter';

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <NewArrivals />
      <BestSellers />
      <QuickDeals />
      <BrandStrip />
      <TrustBadges />
      <Testimonials />
      <Newsletter />
    </>
  );
}
