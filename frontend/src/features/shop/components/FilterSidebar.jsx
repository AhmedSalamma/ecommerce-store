import { Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { cn } from '@/lib/cn';
import { useCategories } from '@/features/products/hooks/useCategories';
import { useBrands } from '@/features/products/hooks/useBrands';
import {
  PRICE_MIN,
  PRICE_MAX,
  RATING_OPTIONS,
  COLOR_OPTIONS,
  STORAGE_OPTIONS,
} from '@/constants/filters';

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-neutral-100 py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-sm font-bold text-neutral-900">{title}</h3>
      {children}
    </div>
  );
}

export function FilterSidebar({ filters, onChange, onClearAll }) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  const toggleInArray = (key, value) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-900">الفلاتر</h2>
        <button type="button" onClick={onClearAll} className="text-xs font-semibold text-primary hover:underline">
          إزالة الكل
        </button>
      </div>

      <FilterSection title="الفئة">
        {categoriesLoading && <p className="text-xs text-neutral-400">جارِ التحميل...</p>}
        {categories?.map((category) => (
          <Checkbox
            key={category.id}
            label={category.name}
            count={category.count}
            checked={filters.categories.includes(category.id)}
            onChange={() => toggleInArray('categories', category.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="العلامة التجارية">
        {brandsLoading && <p className="text-xs text-neutral-400">جارِ التحميل...</p>}
        {brands?.map((brand) => (
          <Checkbox
            key={brand.id}
            label={brand.name}
            count={brand.count}
            checked={filters.brands.includes(brand.id)}
            onChange={() => toggleInArray('brands', brand.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="نطاق السعر">
        <RangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={filters.maxPrice}
          onChange={(value) => onChange({ ...filters, maxPrice: value })}
        />
      </FilterSection>

      <FilterSection title="التقييم">
        {RATING_OPTIONS.map((rating) => (
          <label key={rating} className="flex cursor-pointer items-center justify-between py-1.5">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === rating}
              onChange={() => onChange({ ...filters, minRating: filters.minRating === rating ? null : rating })}
              className="h-3.5 w-3.5 accent-primary"
            />
            <span className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">فأعلى</span>
              <span className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={13}
                    className={index < rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}
                  />
                ))}
              </span>
            </span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="التوفر">
        <Checkbox
          label="المتوفر فقط"
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterSection>

      <FilterSection title="اللون">
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.id}
              type="button"
              aria-label={color.id}
              onClick={() => toggleInArray('colors', color.id)}
              style={{ backgroundColor: color.hex }}
              className={cn(
                'h-7 w-7 rounded-full border-2 transition-transform',
                filters.colors.includes(color.id)
                  ? 'scale-110 border-primary'
                  : 'border-white ring-1 ring-neutral-200'
              )}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="سعة التخزين">
        <div className="flex flex-wrap gap-2">
          {STORAGE_OPTIONS.map((storage) => (
            <button
              key={storage}
              type="button"
              onClick={() => toggleInArray('storages', storage)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                filters.storages.includes(storage)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
              )}
            >
              {storage}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
