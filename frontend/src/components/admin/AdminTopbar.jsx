import { NavLink } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

const LINKS = [
  { to: '/admin', label: 'الرئيسية', end: true },
  { to: '/admin/products', label: 'المنتجات' },
  { to: '/admin/categories', label: 'الفئات' },
  { to: '/admin/users', label: 'المستخدمون' },
];

export function AdminTopbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto lg:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isActive ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <span className="hidden text-sm font-semibold text-neutral-500 lg:block">
          أهلاً بعودتك، {user?.name}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-neutral-100 py-1.5 pr-1.5 pl-3 text-sm font-semibold text-neutral-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
              <User size={14} />
            </span>
            {user?.name}
          </span>
          <button
            type="button"
            onClick={logout}
            aria-label="تسجيل الخروج"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
