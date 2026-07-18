import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
  {
    title: 'تسوق',
    links: [
      { label: 'الهواتف الذكية', to: '/category/phones' },
      { label: 'أجهزة كمبيوتر محمولة', to: '/category/laptops' },
      { label: 'الأجهزة اللوحية', to: '/category/tablets' },
      { label: 'العروض', to: '/shop' },
    ],
  },
  {
    title: 'الدعم',
    links: [
      { label: 'تتبع الطلب', to: '#' },
      { label: 'الاسترجاع', to: '#' },
      { label: 'الضمان', to: '#' },
      { label: 'تواصل معنا', to: '#' },
    ],
  },
  {
    title: 'الشركة',
    links: [
      { label: 'من نحن', to: '#' },
      { label: 'الوظائف', to: '#' },
      { label: 'الصحافة', to: '#' },
      { label: 'الاستدامة', to: '#' },
    ],
  },
  {
    title: 'قانوني',
    links: [
      { label: 'الخصوصية', to: '#' },
      { label: 'الشروط', to: '#' },
      { label: 'ملفات تعريف الارتباط', to: '#' },
      { label: 'إمكانية الوصول', to: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-custom grid grid-cols-2 gap-10 py-14 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <p className="text-xl font-extrabold text-white">تاجر</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            إلكترونيات مختارة بعناية لمن يريد أقل تشويش وأجهزة أفضل.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-bold text-white">{column.title}</p>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-800">
        <div className="container-custom flex flex-col-reverse items-center justify-between gap-3 py-5 text-xs text-neutral-500 sm:flex-row">
          <p>© 2026 تاجر. جميع الحقوق محفوظة.</p>
          <p>Visa · Mastercard · Apple Pay · PayPal</p>
        </div>
      </div>
    </footer>
  );
}
