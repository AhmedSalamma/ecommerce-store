import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ProductFormModal } from '@/features/admin/components/ProductFormModal';
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '@/features/admin/hooks/useAdminProducts';

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useAdminProducts({ page, search: search || undefined });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = data?.products ?? [];
  const meta = data?.meta;

  const handleSubmit = async (payload) => {
    if (formState.product) {
      await updateMutation.mutateAsync({ id: formState.product.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setFormState({ open: false, product: null });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-neutral-900">المنتجات</h1>
        <Button size="sm" onClick={() => setFormState({ open: true, product: null })}>
          <Plus size={16} />
          إضافة منتج
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 right-3.5 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="ابحث عن منتج..."
          className="pr-10"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
              <th className="px-4 py-3 font-medium">المنتج</th>
              <th className="px-4 py-3 font-medium">الفئة</th>
              <th className="px-4 py-3 font-medium">السعر</th>
              <th className="px-4 py-3 font-medium">المخزون</th>
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
                  تعذر تحميل المنتجات
                </td>
              </tr>
            )}

            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  لا توجد منتجات
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product.id} className="border-b border-neutral-100 last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={product.image ?? 'https://placehold.co/40x40'}
                    alt={product.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <span className="font-medium text-neutral-900">{product.name}</span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{product.categoryName ?? '—'}</td>
                <td className="px-4 py-3 text-neutral-600">{Number(product.price).toLocaleString()}$</td>
                <td className="px-4 py-3 text-neutral-600">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setFormState({ open: true, product })}
                      aria-label="تعديل"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
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

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                meta.current_page === i + 1 ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ProductFormModal
        open={formState.open}
        product={formState.product}
        onClose={() => setFormState({ open: false, product: null })}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
