import { ProductListing } from '@/features/shop/components/ProductListing';
import { PRICE_MAX } from '@/constants/filters';

const INITIAL_FILTERS = {
  categories: [],
  brands: [],
  maxPrice: PRICE_MAX,
  minRating: null,
  inStockOnly: false,
  colors: [],
  storages: [],
};

export function ShopPage() {
  return <ProductListing title="كل المنتجات" breadcrumb={[{ label: 'تسوق' }]} initialFilters={INITIAL_FILTERS} />;
}
