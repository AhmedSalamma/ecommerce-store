import { Button } from '@/components/ui/Button';

export function Newsletter() {
  return (
    <section className="pb-12">
      <div className="container-custom">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-right">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">احصل على وصول مبكر للإطلاقات</h2>
            <p className="mt-1 text-sm text-blue-100">منتجات جديدة، إعادة تخزين، وأسعار خاصة بالأعضاء.</p>
          </div>

          <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 sm:w-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
            />
            <Button variant="dark" size="sm" className="shrink-0 rounded-full">
              اشترك
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
