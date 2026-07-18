import { cn } from '@/lib/cn';
import { PRODUCT_IMAGE_TONES, CATEGORY_TONES } from '@/constants/products';

export function ProductImage({ imageUrl, category, type, tone, className }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={type ?? category ?? ''}
        className={cn('aspect-square w-full rounded-xl object-cover', className)}
      />
    );
  }

  const resolvedTone = tone ?? CATEGORY_TONES[category] ?? 'gray';

  return (
    <div
      className={cn(
        'flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br',
        PRODUCT_IMAGE_TONES[resolvedTone],
        className
      )}
    >
      <span className="text-xs font-semibold tracking-widest text-white/70">{type ?? category}</span>
    </div>
  );
}
