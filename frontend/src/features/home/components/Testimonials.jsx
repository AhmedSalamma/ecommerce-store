import { StarRating } from '@/components/ui/StarRating';
import { TESTIMONIALS } from '@/constants/products';

export function Testimonials() {
  return (
    <section className="bg-white py-12">
      <div className="container-custom">
        <h2 className="mb-6 text-2xl font-extrabold text-neutral-900">ماذا يقول عملاؤنا</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <StarRating rating={testimonial.rating} size={13} />
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">"{testimonial.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                  {testimonial.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{testimonial.name}</p>
                  <p className="text-xs text-neutral-500">{testimonial.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
