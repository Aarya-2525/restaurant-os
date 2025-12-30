import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ScanQRPage from './pages/ScanQRPage';

// Admin Imports
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/AdminLayout';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminPreviewMenuPage from './pages/AdminPreviewMenuPage';
import AdminQRPage from './pages/AdminQRPage';
import AdminBillsPage from './pages/AdminBillsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [cart, setCart] = useState({});

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev[item.id];
            return {
                ...prev,
                [item.id]: {
                    quantity: (existing?.quantity || 0) + 1,
                    item: item
                }
            };
        });
    };

    const removeFromCart = (item) => {
        setCart((prev) => {
            const existing = prev[item.id];
            if (!existing) return prev;

            if (existing.quantity === 1) {
                const newCart = { ...prev };
                delete newCart[item.id];
                return newCart;
            }

            return {
                ...prev,
                [item.id]: {
                    ...existing,
                    quantity: existing.quantity - 1
                }
            };
        });
    };

    const clearCart = () => {
        setCart({});
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Customer Routes */}
                <Route
                    path="/menu"
                    element={
                        <MenuPage
                            cart={cart}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                        />
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <CheckoutPage
                            cart={cart}
                            clearCart={clearCart}
                        />
                    }
                />
                <Route
                    path="/order-confirmed"
                    element={<OrderConfirmationPage />}
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/orders" replace />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="menu" element={<AdminMenuPage />} />
                        <Route path="preview" element={<AdminPreviewMenuPage />} />
                        <Route path="qr-codes" element={<AdminQRPage />} />
                        <Route path="bills" element={<AdminBillsPage />} />
                    </Route>
                </Route>

                {/* Default Route - Landing Page */}
                <Route path="/" element={<ScanQRPage />} />

                {/* Catch-all Redirect to Landing Page */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
