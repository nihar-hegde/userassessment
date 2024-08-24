import "./App.css";
import Home from "./components/Home";
import LoginForm from "./components/Loginform";
import ProtectedRoute from "./components/ProtectedRoutes";
import RegisterForm from "./components/Registerform";
import { AuthProvider } from "./Provider/AuthProvider";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
