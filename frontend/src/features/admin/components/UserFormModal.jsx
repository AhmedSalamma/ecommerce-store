import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب').max(255),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().optional().or(z.literal('')),
  role: z.enum(['user', 'admin']),
});

export function UserFormModal({ open, onClose, user, onSubmit, submitting }) {
  const isEdit = Boolean(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      isEdit
        ? schema
        : schema.extend({ password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل') })
    ),
    defaultValues: { name: '', email: '', password: '', role: 'user' },
  });

  useEffect(() => {
    if (open) {
      reset(user ? { name: user.name, email: user.email, password: '', role: user.role } : {
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
    }
  }, [open, user, reset]);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'تعديل المستخدم' : 'إضافة مستخدم'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="الاسم" placeholder="الاسم" error={errors.name?.message} {...register('name')} />
        <Input
          label="البريد الإلكتروني"
          type="email"
          placeholder="البريد الإلكتروني"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label={isEdit ? 'كلمة المرور (اتركها فارغة للإبقاء عليها)' : 'كلمة المرور'}
          type="password"
          placeholder="كلمة المرور"
          error={errors.password?.message}
          {...register('password')}
        />
        <Select label="الصلاحية" error={errors.role?.message} {...register('role')}>
          <option value="user">مستخدم</option>
          <option value="admin">مدير</option>
        </Select>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المستخدم'}
        </Button>
      </form>
    </Modal>
  );
}
