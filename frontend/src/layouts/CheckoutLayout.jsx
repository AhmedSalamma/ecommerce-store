import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function CheckoutLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-neutral-100">
        <div className="container-custom flex items-center justify-between py-5">
          <Link to="/" className="text-xl font-extrabold text-neutral-900">
            تاجر
          </Link>
          <Link to="/shop" className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900">
            متابعة التسوق
            <ArrowLeft size={15} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
