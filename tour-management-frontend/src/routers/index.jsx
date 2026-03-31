import { useRoutes } from "react-router-dom";

// Layouts
import ClientLayout from "../Layout/ClientLayout/ClientLayout";
import AdminLayout from "../Layout/AdminLayout/AdminLayout";

// Client Pages
import Categories from "../Pages/Categories";
import Tours from "../Pages/Tours";
import TourDetail from "../Pages/TourDetail";
import Cart from "../Pages/Cart";
import OrderSuccess from "../Pages/OrderSuccess";

// Admin Pages
import AdminTours from "../Pages/AdminTours";
import AdminTourCreate from "../Pages/AdminTourCreate";
import AdminCategories from "../Pages/AdminCategories";

export const RenderRouter = () => {
  const routes = useRoutes([
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
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "tours", element: <AdminTours /> },
        { path: "tours/create", element: <AdminTourCreate /> },
        { path: "categories", element: <AdminCategories /> },
        // Thêm các route admin khác nếu cần
      ],
    },
  ]);

  return routes;
};
