import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-blue-800',
        dark: 'bg-neutral-900 text-white hover:bg-neutral-800',
        outline: 'border border-neutral-300 text-neutral-800 hover:border-neutral-400 bg-white',
        ghost: 'text-neutral-800 hover:bg-neutral-100',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export function Button({ className, variant, size, as: Component = 'button', ...props }) {
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
