import { ProductCard } from '@/components/shared/ProductCard';
import { Countdown } from '@/components/ui/Countdown';
import { useProducts } from '@/features/products/hooks/useProducts';

export function QuickDeals() {
  const { data } = useProducts({ on_sale: 1, per_page: 4 });
  const products = data?.products ?? [];

  return (
    <section className="bg-neutral-900 py-10">
      <div className="container-custom">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">عروض سريعة</h2>
            <p className="mt-1 text-sm text-neutral-400">أسعار مخفضة لمدة 48 ساعة فقط</p>
          </div>

          <Countdown initialSeconds={14 * 3600 + 32 * 60 + 8} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} dark />
          ))}
        </div>
      </div>
    </section>
  );
}
