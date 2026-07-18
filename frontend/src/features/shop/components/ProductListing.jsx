import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { Button } from '@/components/ui/Button';
import { FilterSidebar } from '@/features/shop/components/FilterSidebar';
import { ShopToolbar } from '@/features/shop/components/ShopToolbar';
import { ActiveFilterChips } from '@/features/shop/components/ActiveFilterChips';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';
import { useBrands } from '@/features/products/hooks/useBrands';
import { PRICE_MAX, COLOR_OPTIONS } from '@/constants/filters';

const EMPTY_FILTERS = {
  categories: [],
  brands: [],
  maxPrice: PRICE_MAX,
  minRating: null,
  inStockOnly: false,
  colors: [],
  storages: [],
};

const SORT_MAP = {
  featured: undefined,
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
  rating: 'rating',
};

export function ProductListing({ title, breadcrumb, initialFilters }) {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...initialFilters });
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('grid');

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const queryParams = useMemo(
    () => ({
      ...(filters.categories.length && { category: filters.categories.join(',') }),
      ...(filters.brands.length && { brand: filters.brands.join(',') }),
      ...(filters.maxPrice < PRICE_MAX && { max_price: filters.maxPrice }),
      ...(filters.minRating && { min_rating: filters.minRating }),
      ...(filters.colors.length && { color: filters.colors.join(',') }),
      ...(filters.storages.length && { storage: filters.storages.join(',') }),
      ...(filters.inStockOnly && { in_stock: 1 }),
      ...(SORT_MAP[sort] && { sort: SORT_MAP[sort] }),
      per_page: 24,
    }),
    [filters, sort]
  );

  const { data, isLoading, isError } = useProducts(queryParams);
  const products = data?.products ?? [];

  const clearAll = () => setFilters(EMPTY_FILTERS);

  const chips = [
    ...(filters.maxPrice < PRICE_MAX
      ? [
          {
            key: 'price',
            label: `أقل من ${filters.maxPrice.toLocaleString()}$`,
            onRemove: () => setFilters({ ...filters, maxPrice: PRICE_MAX }),
          },
        ]
      : []),
    ...filters.brands.map((brandId) => ({
      key: `brand-${brandId}`,
      label: brands?.find((brand) => brand.id === brandId)?.name ?? brandId,
      onRemove: () => setFilters({ ...filters, brands: filters.brands.filter((item) => item !== brandId) }),
    })),
    ...filters.categories.map((categoryId) => ({
      key: `category-${categoryId}`,
      label: categories?.find((category) => category.id === categoryId)?.name ?? categoryId,
      onRemove: () =>
        setFilters({ ...filters, categories: filters.categories.filter((item) => item !== categoryId) }),
    })),
    ...(filters.minRating
      ? [
          {
            key: 'rating',
            label: `${filters.minRating}+ نجوم`,
            onRemove: () => setFilters({ ...filters, minRating: null }),
          },
        ]
      : []),
    ...filters.colors.map((colorId) => ({
      key: `color-${colorId}`,
      label: COLOR_OPTIONS.find((color) => color.id === colorId)?.name ?? colorId,
      onRemove: () => setFilters({ ...filters, colors: filters.colors.filter((item) => item !== colorId) }),
    })),
    ...filters.storages.map((storage) => ({
      key: `storage-${storage}`,
      label: storage,
      onRemove: () => setFilters({ ...filters, storages: filters.storages.filter((item) => item !== storage) }),
    })),
  ];

  return (
    <div className="container-custom py-8">
      <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/" className="hover:text-neutral-700">
          الرئيسية
        </Link>
        {breadcrumb.map((crumb) => (
          <span key={crumb.label} className="flex items-center gap-1.5">
            <ChevronLeft size={12} />
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-neutral-700">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-700">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isLoading ? 'جارِ التحميل...' : `${data?.meta?.total ?? products.length} نتيجة`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar filters={filters} onChange={setFilters} onClearAll={clearAll} />

        <div className="min-w-0 flex-1">
          <ShopToolbar sort={sort} onSortChange={setSort} view={view} onViewChange={setView} />

          <ActiveFilterChips chips={chips} onClearAll={clearAll} />

          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-200 py-20 text-center">
              <p className="text-sm font-semibold text-red-600">تعذر تحميل المنتجات، حاول مرة أخرى</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
              <p className="text-sm font-semibold text-neutral-700">لا توجد نتائج مطابقة للفلاتر المحددة</p>
              <Button variant="outline" size="sm" onClick={clearAll}>
                إزالة كل الفلاتر
              </Button>
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-2 gap-4 sm:grid-cols-3'
                  : 'mx-auto flex max-w-md flex-col gap-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
