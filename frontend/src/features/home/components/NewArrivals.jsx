import { SectionHeader } from '@/components/shared/SectionHeader';
import { ProductCard } from '@/components/shared/ProductCard';
import { Carousel } from '@/components/ui/Carousel';
import { useProducts } from '@/features/products/hooks/useProducts';

export function NewArrivals() {
  const { data } = useProducts({ sort: 'newest', per_page: 5 });
  const products = data?.products ?? [];

  return (
    <section className="bg-neutral-50 py-10">
      <div className="container-custom">
        <SectionHeader title="وصل حديثاً" />

        <Carousel>
          {products.map((product) => (
            <div key={product.id} className="w-44 shrink-0 snap-start sm:w-52">
              <ProductCard product={product} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
