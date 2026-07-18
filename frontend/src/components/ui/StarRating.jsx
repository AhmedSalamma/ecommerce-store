import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function StarRating({ rating = 0, reviews, size = 14, className }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={index < rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}
          />
        ))}
      </div>
      {reviews != null && <span className="text-xs text-neutral-500">({reviews})</span>}
    </div>
  );
}
