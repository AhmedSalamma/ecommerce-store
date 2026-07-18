import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { CheckoutLayout } from '@/layouts/CheckoutLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage';
import { CheckoutCancelPage } from '@/pages/CheckoutCancelPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ProductsPage as AdminProductsPage } from '@/pages/admin/ProductsPage';
import { CategoriesPage as AdminCategoriesPage } from '@/pages/admin/CategoriesPage';
import { UsersPage as AdminUsersPage } from '@/pages/admin/UsersPage';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AdminRoute } from '@/components/shared/AdminRoute';
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap';

function App() {
  return (
    <>
      <AuthBootstrap />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        <Route element={<CheckoutLayout />}>
          <Route path="cart" element={<CartPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
