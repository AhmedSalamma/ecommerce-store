import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { UserFormModal } from '@/features/admin/components/UserFormModal';
import { useAdminUsers, useCreateUser, useDeleteUser, useUpdateUser } from '@/features/admin/hooks/useAdminUsers';

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, user: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { data, isLoading, isError } = useAdminUsers({ page, search: search || undefined });
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const users = data?.users ?? [];
  const meta = data?.meta;

  const handleSubmit = async (payload) => {
    setErrorMessage('');
    try {
      if (formState.user) {
        await updateMutation.mutateAsync({ id: formState.user.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setFormState({ open: false, user: null });
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? 'حدث خطأ، حاول مرة أخرى');
    }
  };

  const handleDelete = async () => {
    setErrorMessage('');
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? 'حدث خطأ، حاول مرة أخرى');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-neutral-900">المستخدمون</h1>
        <Button size="sm" onClick={() => setFormState({ open: true, user: null })}>
          <Plus size={16} />
          إضافة مستخدم
        </Button>
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
      )}

      <div className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 right-3.5 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="ابحث عن مستخدم..."
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
              <th className="px-4 py-3 font-medium">الاسم</th>
              <th className="px-4 py-3 font-medium">البريد الإلكتروني</th>
              <th className="px-4 py-3 font-medium">الصلاحية</th>
              <th className="px-4 py-3 font-medium">الطلبات</th>
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
                  تعذر تحميل المستخدمين
                </td>
              </tr>
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  لا يوجد مستخدمون
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr key={user.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{user.name}</td>
                <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === 'admin' ? 'new' : 'outline'}>
                    {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-neutral-600">{user.orders_count ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setFormState({ open: true, user })}
                      aria-label="تعديل"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
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

      <UserFormModal
        open={formState.open}
        user={formState.user}
        onClose={() => setFormState({ open: false, user: null })}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
