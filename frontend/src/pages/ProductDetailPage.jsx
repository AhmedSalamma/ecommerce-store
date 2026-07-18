import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Check, Truck, ShieldCheck, Lock } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useCart } from '@/features/cart/hooks/useCart';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useProducts } from '@/features/products/hooks/useProducts';
import { COLOR_OPTIONS } from '@/constants/filters';

const MINI_TRUST_BADGES = [
  { icon: Truck, label: 'شحن خلال يومين' },
  { icon: ShieldCheck, label: 'ضمان لعامين' },
  { icon: Lock, label: 'دفع آمن' },
];

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: relatedData } = useProducts(
    { category: product?.category, exclude: product?.id, per_page: 4 },
    { enabled: Boolean(product) }
  );
  const relatedProducts = relatedData?.products ?? [];

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square w-full animate-pulse rounded-xl bg-neutral-200" />
          <div className="space-y-4">
            <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container-custom flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-lg font-bold text-neutral-900">لم يتم العثور على هذا المنتج</p>
        <Button onClick={() => navigate('/shop')} size="sm">
          العودة إلى المتجر
        </Button>
      </div>
    );
  }

  const colorName = COLOR_OPTIONS.find((color) => color.id === (selectedColor ?? product.color))?.name;
  const specLabel = [selectedStorage ?? product.storage, colorName].filter(Boolean).join(' · ');

  const handleAddToCart = () => {
    addItem({ productId: product.id, quantity, specLabel });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-custom py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/" className="hover:text-neutral-700">
          الرئيسية
        </Link>
        <ChevronLeft size={12} />
        <Link to="/shop" className="hover:text-neutral-700">
          تسوق
        </Link>
        {product.categoryName && (
          <>
            <ChevronLeft size={12} />
            <Link to={`/category/${product.category}`} className="hover:text-neutral-700">
              {product.categoryName}
            </Link>
          </>
        )}
        <ChevronLeft size={12} />
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-extrabold text-neutral-900">{product.name}</h1>
            <div className="mt-2">
              <StarRating rating={product.rating} reviews={product.reviews} size={16} />
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-neutral-900">{product.price.toLocaleString()}$</span>
            {product.oldPrice && (
              <span className="text-lg text-neutral-400 line-through">{product.oldPrice.toLocaleString()}$</span>
            )}
            {product.discountPercent && <Badge variant="sale">{product.discountPercent}%-</Badge>}
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600">{product.description}</p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-2 text-sm font-bold text-neutral-900">اللون</p>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    aria-label={color.name}
                    onClick={() => setSelectedColor(color.id)}
                    style={{ backgroundColor: color.hex }}
                    className={`h-8 w-8 rounded-full border-2 transition-transform ${
                      (selectedColor ?? product.color) === color.id
                        ? 'scale-110 border-primary'
                        : 'border-white ring-1 ring-neutral-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {product.storage && (
              <div>
                <p className="mb-2 text-sm font-bold text-neutral-900">سعة التخزين</p>
                <div className="flex flex-wrap gap-2">
                  {['128GB', '256GB', '512GB', '1TB'].map((storage) => (
                    <button
                      key={storage}
                      type="button"
                      onClick={() => setSelectedStorage(storage)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        (selectedStorage ?? product.storage) === storage
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => setQuantity((value) => value + 1)}
              onDecrement={() => setQuantity((value) => Math.max(1, value - 1))}
            />
            <Button onClick={handleAddToCart} size="lg" className="flex-1">
              {added ? (
                <>
                  <Check size={16} />
                  أُضيف إلى السلة
                </>
              ) : (
                'أضف إلى السلة'
              )}
            </Button>
            <Button variant="outline" size="icon" aria-label="أضف إلى المفضلة">
              <Heart size={17} />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-5 border-t border-neutral-100 pt-5">
            {MINI_TRUST_BADGES.map((badge) => (
              <span key={badge.label} className="flex items-center gap-2 text-xs text-neutral-500">
                <badge.icon size={15} className="text-primary" />
                {badge.label}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-50 p-5">
            <h2 className="mb-3 text-sm font-bold text-neutral-900">المواصفات</h2>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-neutral-500">العلامة التجارية</dt>
              <dd className="text-neutral-900">{product.brand}</dd>
              <dt className="text-neutral-500">الفئة</dt>
              <dd className="text-neutral-900">{product.categoryName ?? '—'}</dd>
              <dt className="text-neutral-500">اللون</dt>
              <dd className="text-neutral-900">{colorName ?? '—'}</dd>
              {product.storage && (
                <>
                  <dt className="text-neutral-500">سعة التخزين</dt>
                  <dd className="text-neutral-900">{selectedStorage ?? product.storage}</dd>
                </>
              )}
            </dl>
          </div>
        </div>

        <div>
          <ProductImage imageUrl={product.image} category={product.category} className="w-full" />
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((url) => (
                <ProductImage key={url} imageUrl={url} category={product.category} className="w-full opacity-70" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <SectionHeader title="منتجات ذات صلة" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {relatedData === undefined
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : relatedProducts.map((related) => <ProductCard key={related.id} product={related} />)}
        </div>
      </div>
    </div>
  );
}
