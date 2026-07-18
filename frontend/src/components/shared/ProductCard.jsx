import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/features/cart/hooks/useCart';
import { cn } from '@/lib/cn';

export function ProductCard({ product, rank, dark = false, className }) {
  const { id, name, brand, category, image, price, oldPrice, discountPercent, rating, reviews, badge } = product;
  const { addItem } = useCart();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({ productId: id, quantity: 1, specLabel: null });
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Link
      to={`/product/${id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border p-3 transition-shadow hover:shadow-lg',
        dark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-100 bg-white shadow-sm',
        className
      )}
    >
      <div className="relative">
        <ProductImage imageUrl={image} category={category} />

        <button
          type="button"
          aria-label="أضف إلى المفضلة"
          onClick={handleWishlist}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition-colors hover:text-accent"
        >
          <Heart size={15} />
        </button>

        {badge && (
          <Badge variant="dark" className="absolute top-2 left-2">
            {badge}
          </Badge>
        )}
        {discountPercent && (
          <Badge variant="sale" className="absolute top-2 left-2">
            {discountPercent}%-
          </Badge>
        )}
        {rank != null && (
          <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
            {rank}
          </span>
        )}

        <button
          type="button"
          aria-label="أضف إلى السلة"
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition-transform hover:scale-105"
        >
          <Plus size={17} />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <p className={cn('text-xs', dark ? 'text-neutral-400' : 'text-neutral-500')}>{brand}</p>
        <h3 className={cn('text-sm font-bold leading-tight', dark ? 'text-white' : 'text-neutral-900')}>
          {name}
        </h3>
        <StarRating rating={rating} reviews={reviews} />
        <div className="flex items-baseline gap-2 pt-1">
          <span className={cn('text-base font-extrabold', dark ? 'text-white' : 'text-neutral-900')}>
            {price.toLocaleString()}$
          </span>
          {oldPrice && (
            <span className="text-xs text-neutral-400 line-through">{oldPrice.toLocaleString()}$</span>
          )}
        </div>
      </div>
    </Link>
  );
}
