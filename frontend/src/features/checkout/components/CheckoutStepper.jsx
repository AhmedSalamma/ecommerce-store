import { Check } from 'lucide-react';
import { CHECKOUT_STEPS } from '@/constants/checkout';
import { cn } from '@/lib/cn';

export function CheckoutStepper({ currentStep }) {
  return (
    <div className="mb-10 flex items-center justify-center">
      {CHECKOUT_STEPS.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold',
                  isCurrent && 'bg-primary text-white',
                  isCompleted && 'bg-neutral-900 text-white',
                  !isCurrent && !isCompleted && 'border border-neutral-300 text-neutral-400'
                )}
              >
                {isCompleted ? <Check size={16} /> : step.id}
              </span>
              <span className={cn('text-xs font-medium', isCurrent ? 'text-neutral-900' : 'text-neutral-400')}>
                {step.label}
              </span>
            </div>

            {index < CHECKOUT_STEPS.length - 1 && (
              <div className={cn('mx-3 h-px w-12 sm:w-20', isCompleted ? 'bg-neutral-900' : 'bg-neutral-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
