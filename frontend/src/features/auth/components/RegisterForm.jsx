import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z
  .object({
    firstName: z.string().min(2, 'الاسم الأول مطلوب'),
    lastName: z.string().min(2, 'اسم العائلة مطلوب'),
    email: z.string().email('بريد إلكتروني غير صالح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export function RegisterForm({ onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="الاسم الأول" placeholder="الاسم الأول" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="اسم العائلة" placeholder="اسم العائلة" error={errors.lastName?.message} {...register('lastName')} />
      </div>

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
      <Input
        label="تأكيد كلمة المرور"
        type="password"
        placeholder="تأكيد كلمة المرور"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
      </Button>
    </form>
  );
}
