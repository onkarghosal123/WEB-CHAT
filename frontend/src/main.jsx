import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import AuthProvider from "./contexts/AuthContext.jsx";

// Protected route for ChatPage
function HomeRoute() {
  const { authUser } = useContext(AuthContext);
  console.log("HomeRoute authUser:", authUser);
  return authUser ? <ChatPage /> : <Navigate to="/login" />;
}
// Route for LoginPage
function LoginRoute() {
  const { authUser } = useContext(AuthContext);
  console.log("LoginRoute authUser:", authUser);
  return !authUser ? <LoginPage /> : <Navigate to="/" />;
}
// Route for SignupPage
function SignupRoute() {
  const { authUser } = useContext(AuthContext);
  console.log("SignupRoute authUser:", authUser);
  return !authUser ? <SignupPage /> : <Navigate to="/" />;
}

// Create router ONLY ONCE
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeRoute />,
      },
      {
        path: "/login",
        element: <LoginRoute />,
      },
      {
        path: "/signup",
        element: <SignupRoute />,
      },
    ],
  },
]);


function AppRouter() {
  return <RouterProvider router={router} />;
}


createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);