import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function SectionHeader({ title, viewAllTo = '/shop', dark = false }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className={dark ? 'text-2xl font-extrabold text-white' : 'text-2xl font-extrabold text-neutral-900'}>
        {title}
      </h2>
      <Link
        to={viewAllTo}
        className={
          dark
            ? 'flex items-center gap-1 text-sm font-semibold text-white hover:text-neutral-300'
            : 'flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-800'
        }
      >
        عرض الكل
        <ArrowLeft size={15} />
      </Link>
    </div>
  );
}
