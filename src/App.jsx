import { Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import RegisterPage from "./features/auth/pages/RegisterPage";
import HomePage from "./features/todos/pages/HomePage";
import DetailPage from "./features/todos/pages/DetailPage";
import UsersPage from "./features/users/pages/UsersPage";
import ProfilePage from "./features/users/pages/ProfilePage";
import TodoLayout from "./features/todos/layouts/TodoLayout";
import NotFoundPage from "./features/common/pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard routes */}
      <Route path="/" element={<TodoLayout />}>
        <Route index element={<HomePage />} />
        <Route path="todos/:todoId" element={<DetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
