import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Shop from './components/Shop.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CartDrawer from './components/CartDrawer.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      <CartDrawer />
    </>
  );
}
