import { Truck, ShieldCheck, Lock, Headphones } from 'lucide-react';

const BADGES = [
  {
    icon: Truck,
    title: 'شحن سريع خلال يومين',
    description: 'لكل الطلبات فوق 75$، بلا استثناء.',
  },
  {
    icon: ShieldCheck,
    title: 'ضمان لمدة عامين',
    description: 'كل جهاز مغطى، ويمكن تمديد الضمان عند الشراء.',
  },
  {
    icon: Lock,
    title: 'دفع آمن',
    description: 'تشفير بمستوى البنوك لكل عملية شراء.',
  },
  {
    icon: Headphones,
    title: 'دعم فعلي على مدار الساعة',
    description: 'دعم من بشر، لا روبوتات، وقتما تحتاج.',
  },
];

export function TrustBadges() {
  return (
    <section className="bg-neutral-50 py-12">
      <div className="container-custom grid grid-cols-2 gap-8 lg:grid-cols-4">
        {BADGES.map((badge) => (
          <div key={badge.title} className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <badge.icon size={20} />
            </span>
            <p className="mt-3 text-sm font-bold text-neutral-900">{badge.title}</p>
            <p className="mt-1 text-xs text-neutral-500">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
