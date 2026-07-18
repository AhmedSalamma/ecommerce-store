import { Link } from 'react-router-dom';
import { useCategories } from '@/features/products/hooks/useCategories';
import { CATEGORY_ICONS } from '@/constants/categories';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="py-10">
      <div className="container-custom">
        <h2 className="mb-6 text-2xl font-extrabold text-neutral-900">تسوق حسب الفئة</h2>

        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
              ))
            : categories?.map((category) => {
                const Icon = CATEGORY_ICONS[category.id];
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-white py-5 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary">
                      {Icon && <Icon size={20} />}
                    </span>
                    <span className="px-1 text-xs font-medium text-neutral-700">{category.name}</span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
