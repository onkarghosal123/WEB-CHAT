import { StrictMode, Children, useState, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { AuthContext } from './contexts/AuthContext.jsx'
import AuthProvider from './contexts/AuthContext.jsx'

function AppRouter (){
const {authUser} = useContext(AuthContext);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: authUser ? <ChatPage /> : <Navigate to={'/login'} />
      },
      {
        path: '/login',
        element: !authUser ? <LoginPage /> : <Navigate to={'/'} />
      },
      {
        path: '/signup',
        element: !authUser ? <SignupPage/> : <Navigate to={'/'} />
      }
    ]
  },

])
return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
)
