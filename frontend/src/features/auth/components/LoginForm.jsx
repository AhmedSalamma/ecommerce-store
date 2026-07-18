import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export function LoginForm({ onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="البريد الإلكتروني"
        type="email"
        placeholder="البريد الإلكتروني"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="كلمة المرور"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-1.5 text-neutral-600">
          <input type="checkbox" className="h-3.5 w-3.5 accent-primary" />
          تذكرني
        </label>
        <a href="#" className="font-semibold text-primary hover:underline">
          نسيت كلمة المرور؟
        </a>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
      </Button>
    </form>
  );
}
