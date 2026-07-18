import { SectionHeader } from '@/components/shared/SectionHeader';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { useProducts } from '@/features/products/hooks/useProducts';

export function BestSellers() {
  const { data, isLoading } = useProducts({ sort: 'best_selling', per_page: 4 });
  const products = data?.products ?? [];

  return (
    <section className="bg-neutral-50 py-10">
      <div className="container-custom">
        <SectionHeader title="الأكثر مبيعاً" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : products.map((product, index) => (
                <ProductCard key={product.id} product={product} rank={index + 1} />
              ))}
        </div>
      </div>
    </section>
  );
}
