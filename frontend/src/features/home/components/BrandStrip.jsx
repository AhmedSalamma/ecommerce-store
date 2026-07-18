import { useBrands } from '@/features/products/hooks/useBrands';

export function BrandStrip() {
  const { data: brands } = useBrands();

  return (
    <section className="border-b border-neutral-100 bg-white py-10">
      <div className="container-custom flex flex-wrap items-center justify-between gap-6">
        {brands?.map((brand) => (
          <span key={brand.id} className="text-lg font-bold text-neutral-300">
            {brand.name}
          </span>
        ))}
      </div>
    </section>
  );
}
