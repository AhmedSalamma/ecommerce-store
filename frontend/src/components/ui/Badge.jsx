import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva('inline-flex items-center rounded-md font-bold px-2 py-1 text-xs', {
  variants: {
    variant: {
      dark: 'bg-neutral-900 text-white',
      sale: 'bg-accent text-white',
      new: 'bg-primary text-white',
      light: 'bg-white text-neutral-900 shadow',
      outline: 'border border-neutral-200 text-neutral-600 bg-white',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
