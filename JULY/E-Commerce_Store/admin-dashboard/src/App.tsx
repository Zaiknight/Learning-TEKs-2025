import Dashboard from "./routes/dashboard/dashboard"
import { ThemeProvider } from "./components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/login/login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Signup from "./routes/signup/signup";
import UsersPage from "./routes/users/UsersPage";
import CategoriesPage from "./routes/categories/CategoriesPage";
import ProductsPage from "./routes/products/ProductsPage";
import OrdersPage from "./routes/orders/OrderPage";


function App() {

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<ProtectedRoutes/>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/orders" element={<OrdersPage/>} />
              </Route>
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
