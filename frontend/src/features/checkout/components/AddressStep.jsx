import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAddresses } from '@/features/checkout/hooks/useAddresses';
import { useCreateAddress } from '@/features/checkout/hooks/useCreateAddress';
import { useShippingPrices } from '@/features/checkout/hooks/useShippingPrices';

const COUNTRIES = ['مصر', 'البحرين', 'السعودية', 'الإمارات', 'الكويت', 'قطر', 'عُمان'];

const schema = z.object({
  full_name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(8, 'رقم هاتف غير صالح'),
  country: z.string().min(1, 'الدولة مطلوبة'),
  city: z.string().min(1, 'المدينة مطلوبة'),
  state: z.string().optional(),
  street: z.string().min(5, 'العنوان مطلوب'),
  notes: z.string().optional(),
});

export function AddressStep({ onSelect }) {
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { data: shippingPrices } = useShippingPrices();
  const createAddress = useCreateAddress();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleCreate = async (data) => {
    const address = await createAddress.mutateAsync(data);
    onSelect(address);
  };

  const hasSavedAddresses = (addresses?.length ?? 0) > 0;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-neutral-900">عنوان الشحن</h2>

      {addressesLoading && <p className="text-sm text-neutral-500">جارِ التحميل...</p>}

      {hasSavedAddresses && !showForm && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address)}
              className="block w-full rounded-xl border border-neutral-200 p-4 text-right text-sm transition-colors hover:border-primary"
            >
              <p className="font-bold text-neutral-900">{address.full_name}</p>
              <p className="mt-1 text-neutral-500">
                {address.street}، {address.city}، {address.country}
              </p>
              <p className="text-neutral-500">{address.phone}</p>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Plus size={15} />
            إضافة عنوان جديد
          </button>
        </div>
      )}

      {(!hasSavedAddresses || showForm) && (
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="الاسم الكامل" placeholder="الاسم الكامل" error={errors.full_name?.message} {...register('full_name')} />
            <Input label="رقم الهاتف" type="tel" placeholder="رقم الهاتف" error={errors.phone?.message} {...register('phone')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="الدولة" defaultValue="" error={errors.country?.message} {...register('country')}>
              <option value="" disabled>
                اختر الدولة
              </option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>

            <Select label="المدينة" defaultValue="" error={errors.city?.message} {...register('city')}>
              <option value="" disabled>
                اختر المدينة
              </option>
              {shippingPrices?.map((price) => (
                <option key={price.id} value={price.area_name}>
                  {price.area_name}
                </option>
              ))}
            </Select>
          </div>

          <Input label="المحافظة / المنطقة" placeholder="اختياري" error={errors.state?.message} {...register('state')} />
          <Input label="العنوان" placeholder="اسم الشارع، رقم المبنى" error={errors.street?.message} {...register('street')} />
          <Input label="ملاحظات" placeholder="اختياري" error={errors.notes?.message} {...register('notes')} />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" size="lg" disabled={createAddress.isPending}>
              {createAddress.isPending ? 'جارِ الحفظ...' : 'استخدام هذا العنوان'}
            </Button>
            {hasSavedAddresses && (
              <Button type="button" variant="ghost" size="lg" onClick={() => setShowForm(false)}>
                إلغاء
              </Button>
            )}
          </div>

          {createAddress.isError && (
            <p className="text-sm text-red-600">
              {createAddress.error?.response?.data?.message ?? 'تعذر حفظ العنوان'}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
