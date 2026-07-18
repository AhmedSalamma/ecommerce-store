import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { PromoBar } from '@/components/layout/PromoBar';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';

const NAV_LINKS = [
  { label: 'تسوق', to: '/shop' },
  { label: 'الهواتف', to: '/category/phones' },
  { label: 'أجهزة الكمبيوتر', to: '/category/laptops' },
  { label: 'الأجهزة اللوحية', to: '/category/tablets' },
  { label: 'العروض', to: '/shop' },
];

export function Header() {
  const { itemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white">
      <PromoBar />

      <div className="container-custom flex items-center gap-6 py-4">
        <Link to="/" className="shrink-0 text-2xl font-extrabold text-neutral-900">
          تاجر
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative hidden flex-1 md:block">
          <Search size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="ابحث عن المنتجات والعلامات التجارية..."
            className="w-full rounded-full bg-neutral-100 py-2.5 pr-11 pl-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="المفضلة"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 sm:flex"
          >
            <Heart size={19} />
          </button>

          <Link
            to="/cart"
            aria-label="سلة التسوق"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <ShoppingCart size={19} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  aria-label="لوحة التحكم"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
                >
                  <LayoutDashboard size={17} />
                </Link>
              )}
              <Link
                to="/orders"
                className="flex items-center gap-2 rounded-full bg-neutral-100 py-1.5 pr-1.5 pl-4 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-200"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <User size={14} />
                </span>
                {user?.name}
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="تسجيل الخروج"
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Button as={Link} to="/login" variant="dark" size="sm" className="rounded-full">
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
