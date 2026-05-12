import { useRoutes, Navigate } from "react-router-dom";

// Layouts
import ClientLayout from "../Layout/client/ClientLayout/ClientLayout";
import AdminLayout from "../Layout/admin/AdminLayout/AdminLayout";

// Auth guard
import ProtectedRoute from "../components/ProtectedRoute";

// Client Pages
import Categories from "../Pages/client/Categories";
import Tours from "../Pages/client/Tours";
import TourDetail from "../Pages/client/TourDetail";
import Cart from "../Pages/client/Cart";
import OrderSuccess from "../Pages/client/OrderSuccess";
import OrderHistory from "../Pages/client/OrderHistory/OrderHistory";
import ClientAuth from "../Pages/client/ClientAuth/ClientAuth";

// Admin Auth
import AdminLogin from "../Pages/admin/AdminLogin/AdminLogin";

// Admin Dashboard
import AdminDashboard from "../Pages/admin/AdminDashboard/AdminDashboard";

// Admin Pages – Tours
import AdminTours from "../Pages/admin/AdminTours";
import AdminTourCreate from "../Pages/admin/AdminTourCreate";
import AdminTourEdit from "../Pages/admin/AdminTourEdit";
import AdminTourDetail from "../Pages/admin/AdminTourDetail";

// Admin Pages – Orders
import AdminOrders from "../Pages/admin/AdminOrders/AdminOrders";

// Admin Pages – Categories
import AdminCategories from "../Pages/admin/AdminCategories";
import AdminCategoryCreate from "../Pages/admin/AdminCategoryCreate";
import AdminCategoryEdit from "../Pages/admin/AdminCategoryEdit";
import AdminCategoryDetail from "../Pages/admin/AdminCategoryDetail";

// Admin Pages – Phân quyền
import AdminAccounts from "../Pages/admin/AdminAccounts/AdminAccounts";
import AdminAccountCreate from "../Pages/admin/AdminAccountCreate/AdminAccountCreate";
import AdminAccountEdit from "../Pages/admin/AdminAccountEdit/AdminAccountEdit";
import AdminRoles from "../Pages/admin/AdminRoles/AdminRoles";
import AdminRoleCreate from "../Pages/admin/AdminRoleCreate/AdminRoleCreate";
import AdminRoleEdit from "../Pages/admin/AdminRoleEdit/AdminRoleEdit";
import AdminPermissions from "../Pages/admin/AdminPermissions/AdminPermissions";

export const RenderRouter = () => {
  const routes = useRoutes([
    // ============================
    // CLIENT ROUTES
    // ============================
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        { path: "/", element: <Categories /> },
        { path: "/categories", element: <Categories /> },
        { path: "/tours/:slugCategory", element: <Tours /> },
        { path: "/tours/detail/:slugTour", element: <TourDetail /> },
        { path: "/cart", element: <Cart /> },
        { path: "/order/success", element: <OrderSuccess /> },
        { path: "/order/history", element: <OrderHistory /> },
      ],
    },

    // ============================
    // ADMIN LOGIN (không bảo vệ)
    // ============================
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },

    // ============================
    // CLIENT LOGIN / ĐĂNG KÝ (không bảo vệ)
    // ============================
    {
      path: "/login",
      element: <ClientAuth />,
    },
    {
      path: "/register",
      element: <ClientAuth />,
    },

    // ============================
    // ADMIN ROUTES (cần đăng nhập)
    // ============================
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        // Redirect /admin → /admin/dashboard
        { index: true, element: <Navigate to="dashboard" replace /> },

        // Dashboard
        { path: "dashboard", element: <AdminDashboard /> },

        // Tours
        { path: "tours", element: <AdminTours /> },
        { path: "tours/create", element: <AdminTourCreate /> },
        { path: "tours/edit/:id", element: <AdminTourEdit /> },
        { path: "tours/detail/:id", element: <AdminTourDetail /> },

        // Orders
        { path: "orders", element: <AdminOrders /> },

        // Categories
        { path: "categories", element: <AdminCategories /> },
        { path: "categories/create", element: <AdminCategoryCreate /> },
        { path: "categories/edit/:id", element: <AdminCategoryEdit /> },
        { path: "categories/detail/:id", element: <AdminCategoryDetail /> },

        // Accounts
        { path: "accounts", element: <AdminAccounts /> },
        { path: "accounts/create", element: <AdminAccountCreate /> },
        { path: "accounts/edit/:id", element: <AdminAccountEdit /> },

        // Roles & Permissions
        { path: "roles", element: <AdminRoles /> },
        { path: "roles/create", element: <AdminRoleCreate /> },
        { path: "roles/edit/:id", element: <AdminRoleEdit /> },
        { path: "roles/permissions", element: <AdminPermissions /> },
      ],
    },
  ]);

  return routes;
};
