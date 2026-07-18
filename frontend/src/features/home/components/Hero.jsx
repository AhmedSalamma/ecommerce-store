import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            جديد — تشكيلة الخريف متوفرة الآن
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-neutral-900 lg:text-5xl">
            تقنية، بأبسط صورها.
          </h1>

          <p className="mt-5 max-w-md text-neutral-600">
            هواتف وأجهزة كمبيوتر محمولة وأجهزة لوحية منتقاة بعناية من العلامات المهمة. بلا تعقيد، بلا حيل —
            فقط الأجهزة التي تستحق أموالك.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as={Link} to="/shop" size="lg">
              تسوق التشكيلة
            </Button>
            <Button as={Link} to="/shop" variant="outline" size="lg">
              استعرض العروض
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-300">
            <span className="absolute top-4 right-4 text-xs font-medium text-neutral-500">جهاز مميز</span>
            <div className="h-3/4 w-1/3 rounded-2xl bg-neutral-900 shadow-xl" />
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
              A
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900">Aether Pro 15</p>
              <p className="text-xs text-neutral-500">
                يبدأ من <span className="font-semibold text-neutral-900">1,299$</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
