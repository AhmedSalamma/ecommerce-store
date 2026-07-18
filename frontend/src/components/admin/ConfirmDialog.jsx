import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <p className="text-sm text-neutral-600">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button variant="dark" size="sm" className="bg-accent hover:bg-red-600" onClick={onConfirm} disabled={loading}>
          {loading ? 'جارٍ الحذف...' : 'حذف'}
        </Button>
      </div>
    </Modal>
  );
}
