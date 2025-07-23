import Dashboard from "./routes/dashboard/dashboard"
import { ThemeProvider } from "./components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/login/login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Signup from "./routes/signup/signup";


function App() {

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoutes/>}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
