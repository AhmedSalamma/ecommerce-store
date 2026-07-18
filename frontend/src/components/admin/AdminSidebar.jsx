import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Users, Store } from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { to: '/admin', label: 'الرئيسية', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'المنتجات', icon: Package },
  { to: '/admin/categories', label: 'الفئات', icon: Tags },
  { to: '/admin/users', label: 'المستخدمون', icon: Users },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-l border-neutral-200 bg-white lg:flex lg:flex-col">
      <div className="px-6 py-5">
        <span className="text-xl font-extrabold text-neutral-900">لوحة التحكم</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100',
                isActive && 'bg-primary/10 text-primary'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neutral-200 p-3">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <Store size={18} />
          العودة للمتجر
        </NavLink>
      </div>
    </aside>
  );
}
