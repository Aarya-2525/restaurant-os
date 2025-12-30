import React, { useEffect, useState } from 'react';
import { fetchAdminOrders, updateOrderStatus, clearOrders } from '../lib/api';
import { Clock, CheckCircle, AlertCircle, Trash2, ShoppingBag } from 'lucide-react';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const loadOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const data = await fetchAdminOrders(token);
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await updateOrderStatus(token, orderId, newStatus);
            loadOrders(); // Refresh
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleClearOrders = async () => {
        if (!window.confirm('Are you sure you want to clear all completed and cancelled orders?')) return;
        try {
            await clearOrders();
            loadOrders();
        } catch (err) {
            alert('Failed to clear orders');
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    // Group orders
    const upcomingOrders = filteredOrders.filter(o => o.status === 'pending' || o.status === 'preparing');
    const pastOrders = filteredOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');

    const OrderCard = ({ order }) => (
        <div className={`bg-[#0A0A0A] p-6 rounded-3xl border border-[#2F3336] transition-all duration-300 hover:border-[#FF5A1F]/30`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-xl text-[#FFFFFF]">Order #{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'pending' ? 'bg-[#FF5A1F]/10 text-[#FF5A1F]' : 'bg-green-500/10 text-green-500'}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-[#A0A0A0] text-sm font-medium">Table {order.table_number} • {new Date(order.created_at).toLocaleTimeString()}</p>
                </div>

                {order.status === 'pending' && (
                    <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="bg-[#FF5A1F] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#E44D15] transition-all active:scale-95 shadow-lg shadow-[#FF5A1F]/20"
                    >
                        Mark Completed
                    </button>
                )}
            </div>

            <div className="space-y-3 border-t border-[#2F3336] pt-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-[#FFFFFF] font-medium">
                            <span className="text-[#FF5A1F] font-bold mr-2">{item.quantity}x</span>
                            {item.menu_item?.name || item.menu_item_name || `Item ${item.menu_item}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-[#A0A0A0] animate-pulse font-medium">Loading orders...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-[#FFFFFF] mb-2">Orders</h1>
                    <p className="text-[#A0A0A0] font-medium">Manage and track live restaurant orders</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-[#16181C] p-1.5 rounded-full border border-[#2F3336]">
                        {['all', 'pending', 'completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-8 py-2.5 rounded-full capitalize text-sm font-bold transition-all duration-300 ${filter === f ? 'bg-[#FF5A1F] text-white shadow-xl shadow-[#FF5A1F]/20' : 'text-[#A0A0A0] hover:text-[#FFFFFF]'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleClearOrders}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full hover:bg-red-500/20 transition-all text-sm font-bold active:scale-95"
                        title="Clear Completed & Cancelled Orders"
                    >
                        <Trash2 size={18} />
                        Clear History
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-10 flex items-center gap-4">
                    <AlertCircle size={24} />
                    <span className="font-bold">{error}</span>
                </div>
            )}

            <div className="space-y-16">
                {/* Upcoming Section */}
                {upcomingOrders.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8 flex items-center gap-4">
                            <div className="bg-[#FF5A1F]/10 p-3 rounded-2xl">
                                <Clock className="text-[#FF5A1F]" size={24} />
                            </div>
                            Upcoming Orders
                            <span className="bg-[#16181C] text-[#FF5A1F] text-xs px-3 py-1 rounded-full border border-[#FF5A1F]/20 font-bold">
                                {upcomingOrders.length}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {upcomingOrders.map(order => <OrderCard key={order.id} order={order} />)}
                        </div>
                    </section>
                )}

                {/* Past Section */}
                {pastOrders.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8 flex items-center gap-4">
                            <div className="bg-green-500/10 p-3 rounded-2xl">
                                <CheckCircle className="text-green-500" size={24} />
                            </div>
                            Completed Orders
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-60">
                            {pastOrders.map(order => <OrderCard key={order.id} order={order} />)}
                        </div>
                    </section>
                )}

                {upcomingOrders.length === 0 && pastOrders.length === 0 && (
                    <div className="text-center py-32 bg-[#0A0A0A] rounded-[40px] border-2 border-dashed border-[#2F3336]">
                        <ShoppingBag size={64} className="mx-auto mb-6 text-[#A0A0A0] opacity-20" />
                        <p className="text-[#A0A0A0] font-bold text-2xl">No orders found.</p>
                        <p className="text-[#A0A0A0]/50 font-medium mt-2">New orders will appear here automatically.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
