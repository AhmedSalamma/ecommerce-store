import { SectionHeader } from '@/components/shared/SectionHeader';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { useProducts } from '@/features/products/hooks/useProducts';

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ featured: 1, per_page: 4 });
  const products = data?.products ?? [];

  return (
    <section className="py-10">
      <div className="container-custom">
        <SectionHeader title="منتجات مميزة" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
