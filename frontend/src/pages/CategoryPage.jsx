import { useParams, useNavigate } from 'react-router-dom';
import { ProductListing } from '@/features/shop/components/ProductListing';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/features/products/hooks/useCategories';
import { PRICE_MAX } from '@/constants/filters';

export function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();
  const category = categories?.find((item) => item.id === categoryId);

  if (isLoading) {
    return <div className="container-custom py-24 text-center text-sm text-neutral-500">جارِ التحميل...</div>;
  }

  if (!category) {
    return (
      <div className="container-custom flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-lg font-bold text-neutral-900">لم يتم العثور على هذه الفئة</p>
        <Button onClick={() => navigate('/shop')} size="sm">
          العودة إلى المتجر
        </Button>
      </div>
    );
  }

  const initialFilters = {
    categories: [categoryId],
    brands: [],
    maxPrice: PRICE_MAX,
    minRating: null,
    inStockOnly: false,
    colors: [],
    storages: [],
  };

  return (
    <ProductListing
      key={categoryId}
      title={category.name}
      breadcrumb={[{ label: 'تسوق', to: '/shop' }, { label: category.name }]}
      initialFilters={initialFilters}
    />
  );
}
