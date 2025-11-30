import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import GuestCheckoutPage from "./pages/GuestCheckoutPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminVouchersPage from "./pages/admin/AdminVouchersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderDetailPage from "./pages/OrderDetailPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import HelpPage from "./pages/HelpPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import ShippingPage from "./pages/ShippingPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import AccountPage from "./pages/AccountPage";
import AccountLayout from "./pages/account/AccountLayout";
import AccountBankPage from "./pages/account/AccountBankPage";
import AccountAddressesPage from "./pages/account/AccountAddressesPage";
import AccountPasswordPage from "./pages/account/AccountPasswordPage";
import NotificationsPage from "./pages/NotificationsPage";
import VoucherWalletPage from "./pages/VoucherWalletPage";
import CoinsPage from "./pages/CoinsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/help" element={<HelpPage />} />
          <Route path="/policy/return" element={<ReturnPolicyPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/account">
              <Route index element={<AccountPage />} />
              <Route path="profile" element={<AccountPage />} />
              <Route path="bank" element={<AccountBankPage />} />
              <Route path="addresses" element={<AccountAddressesPage />} />
              <Route path="password" element={<AccountPasswordPage />} />
            </Route>
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/vouchers" element={<VoucherWalletPage />} />
            <Route path="/coins" element={<CoinsPage />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requireAdmin>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vouchers"
            element={
              <ProtectedRoute requireAdmin>
                <AdminVouchersPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
