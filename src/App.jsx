import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LostFoundLayout from "./features/lost-founds/layouts/LostFoundLayout";

const HomePage = lazy(() => import("./features/lost-founds/pages/HomePage"));
const DetailPage = lazy(() => import("./features/lost-founds/pages/DetailPage"));
const UsersPage = lazy(() => import("./features/users/pages/UsersPage"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));

function App() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col items-center justify-center py-20 min-h-[300px]">
          <h1 className="sr-only">Memuat halaman</h1>
          <div role="status" className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm font-medium text-slate-700">Memuat halaman...</p>
          </div>
        </main>
      }
    >
      <Routes>
        {/* Auth routes */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard routes */}
        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost-founds/:id" element={<DetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
