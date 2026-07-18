import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { CategoryFormModal } from '@/features/admin/components/CategoryFormModal';
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/admin/hooks/useAdminCategories';

export function CategoriesPage() {
  const [formState, setFormState] = useState({ open: false, category: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: categories = [], isLoading, isError } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleSubmit = async (payload) => {
    if (formState.category) {
      await updateMutation.mutateAsync({ id: formState.category.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setFormState({ open: false, category: null });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-neutral-900">الفئات</h1>
        <Button size="sm" onClick={() => setFormState({ open: true, category: null })}>
          <Plus size={16} />
          إضافة فئة
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
              <th className="px-4 py-3 font-medium">الفئة</th>
              <th className="px-4 py-3 font-medium">المعرف</th>
              <th className="px-4 py-3 font-medium">عدد المنتجات</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  جارٍ التحميل...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-red-500">
                  تعذر تحميل الفئات
                </td>
              </tr>
            )}

            {!isLoading && categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  لا توجد فئات
                </td>
              </tr>
            )}

            {categories.map((category) => (
              <tr key={category.id} className="border-b border-neutral-100 last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={category.image ?? 'https://placehold.co/40x40'}
                    alt={category.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <span className="font-medium text-neutral-900">{category.name}</span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{category.slug}</td>
                <td className="px-4 py-3 text-neutral-600">{category.productsCount ?? 0}</td>
                <td className="px-4 py-3">
                  <Badge variant={category.isActive ? 'new' : 'outline'}>
                    {category.isActive ? 'نشطة' : 'غير نشطة'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setFormState({ open: true, category })}
                      aria-label="تعديل"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(category)}
                      aria-label="حذف"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-accent transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoryFormModal
        open={formState.open}
        category={formState.category}
        onClose={() => setFormState({ open: false, category: null })}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف الفئة"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ سيتم حذف هذه الفئة نهائياً.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
