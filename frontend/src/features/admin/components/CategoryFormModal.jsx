import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب').max(120),
  slug: z.string().min(2, 'المعرف مطلوب'),
  description: z.string().optional(),
});

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function CategoryFormModal({ open, onClose, category, onSubmit, submitting }) {
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', isActive: true },
  });

  useEffect(() => {
    if (open) {
      reset(
        category
          ? {
              name: category.name,
              slug: category.slug,
              description: category.description ?? '',
              isActive: category.isActive,
            }
          : { name: '', slug: '', description: '', isActive: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  const handleNameBlur = (e) => {
    if (!isEdit) {
      setValue('slug', slugify(e.target.value || ''));
    }
  };

  const submit = (data) => {
    onSubmit({
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      image: data.image?.[0],
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'تعديل الفئة' : 'إضافة فئة'}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="اسم الفئة"
          placeholder="اسم الفئة"
          error={errors.name?.message}
          {...register('name', { onBlur: handleNameBlur })}
        />
        <Input label="المعرف (slug)" placeholder="category-slug" error={errors.slug?.message} {...register('slug')} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">الوصف</label>
          <textarea
            rows={3}
            placeholder="وصف الفئة"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('description')}
          />
        </div>

        <Input label="صورة الفئة" type="file" accept="image/*" {...register('image')} />

        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Checkbox label="فئة نشطة" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          )}
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الفئة'}
        </Button>
      </form>
    </Modal>
  );
}
