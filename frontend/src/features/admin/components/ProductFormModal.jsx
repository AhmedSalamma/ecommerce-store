import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAdminCategories } from '@/features/admin/hooks/useAdminCategories';

const schema = z.object({
  title: z.string().min(2, 'العنوان مطلوب').max(80),
  slug: z.string().min(2, 'المعرف مطلوب'),
  categoryId: z.string().min(1, 'اختر فئة'),
  price: z.coerce.number().min(0, 'السعر يجب أن يكون أكبر من أو يساوي 0'),
  stock: z.coerce.number().int().min(0, 'المخزون يجب أن يكون أكبر من أو يساوي 0'),
  description: z.string().min(1, 'الوصف مطلوب'),
});

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ProductFormModal({ open, onClose, product, onSubmit, submitting }) {
  const { data: categories = [] } = useAdminCategories();
  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', slug: '', categoryId: '', price: '', stock: '', description: '' },
  });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              title: product.name,
              slug: product.slug,
              categoryId: String(categories.find((c) => c.slug === product.category)?.id ?? ''),
              price: product.price,
              stock: product.stock,
              description: product.description ?? '',
            }
          : { title: '', slug: '', categoryId: '', price: '', stock: '', description: '' }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  const handleTitleBlur = (e) => {
    if (!isEdit) {
      setValue('slug', slugify(e.target.value || ''));
    }
  };

  const submit = (data) => {
    onSubmit({
      title: data.title,
      slug: data.slug,
      categoryId: data.categoryId,
      price: data.price,
      stock: data.stock,
      description: data.description,
      image: data.image?.[0],
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'تعديل المنتج' : 'إضافة منتج'}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="اسم المنتج"
          placeholder="اسم المنتج"
          error={errors.title?.message}
          {...register('title', { onBlur: handleTitleBlur })}
        />
        <Input label="المعرف (slug)" placeholder="product-slug" error={errors.slug?.message} {...register('slug')} />

        <Select label="الفئة" error={errors.categoryId?.message} {...register('categoryId')}>
          <option value="">اختر فئة</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="السعر"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input label="المخزون" type="number" placeholder="0" error={errors.stock?.message} {...register('stock')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">الوصف</label>
          <textarea
            rows={3}
            placeholder="وصف المنتج"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('description')}
          />
          {errors.description?.message && (
            <span className="text-xs text-red-500">{errors.description.message}</span>
          )}
        </div>

        <Input label="صورة المنتج" type="file" accept="image/*" {...register('image')} />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </Button>
      </form>
    </Modal>
  );
}
