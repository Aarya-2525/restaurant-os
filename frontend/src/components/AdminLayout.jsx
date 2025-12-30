import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, LogOut, Eye, Palette, QrCode, FileText } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-black text-[#FFFFFF] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-black border-r border-[#2F3336] flex flex-col fixed h-full">
                <div className="p-8 border-b border-[#2F3336]">
                    <h1 className="text-3xl font-bold text-[#FF5A1F] tracking-tighter">Admin</h1>
                </div>

                <nav className="flex-1 p-6 space-y-3">
                    <Link
                        to="/admin/orders"
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive('/admin/orders') ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold shadow-lg shadow-[#FF5A1F]/5' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        <ShoppingBag size={24} />
                        <span className="text-lg">Orders</span>
                    </Link>
                    <Link
                        to="/admin/menu"
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive('/admin/menu') ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold shadow-lg shadow-[#FF5A1F]/5' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        <UtensilsCrossed size={24} />
                        <span className="text-lg">Menu</span>
                    </Link>
                    <Link
                        to="/admin/preview"
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive('/admin/preview') ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold shadow-lg shadow-[#FF5A1F]/5' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        <Eye size={24} />
                        <span className="text-lg">Preview</span>
                    </Link>
                    <Link
                        to="/admin/qr-codes"
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive('/admin/qr-codes') ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold shadow-lg shadow-[#FF5A1F]/5' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        <QrCode size={24} />
                        <span className="text-lg">QR Codes</span>
                    </Link>
                    <Link
                        to="/admin/bills"
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive('/admin/bills') ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold shadow-lg shadow-[#FF5A1F]/5' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        <FileText size={24} />
                        <span className="text-lg">Bills</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-[#2F3336]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-6 py-4 w-full text-left text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 font-bold"
                    >
                        <LogOut size={24} />
                        <span className="text-lg">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 bg-black min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
