import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      <Link to="/" className="mb-8 text-2xl font-extrabold text-neutral-900">
        تاجر
      </Link>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
