import React, { useEffect, useState } from 'react';
import { fetchAdminOrders } from '../lib/api';
import { FileText, Download, Printer, Search, Calendar, CreditCard } from 'lucide-react';
import { generateReceiptText } from '../lib/receipt';

const AdminBillsPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const data = await fetchAdminOrders(token);
            // Only show completed orders for bills
            setOrders(data.filter(o => o.status === 'completed'));
        } catch (err) {
            setError('Failed to load completed orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.table_number.toString().includes(searchTerm)
    );

    const renderReceipt = (order) => {
        const text = generateReceiptText(order);
        if (window.receiptline) {
            return window.receiptline.transform(text, { cpl: 32, encoding: 'cp437' });
        }
        return `<pre style="color: black; font-family: monospace;">${text}</pre>`;
    };

    const handlePrint = (order) => {
        const svg = renderReceipt(order);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Bill - Order #${order.id}</title>
                    <style>
                        body { display: flex; justify-content: center; padding: 20px; background: white; }
                        .bill { width: 100%; max-width: 400px; }
                        svg { width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    <div class="bill">
                        ${svg}
                    </div>
                    <script>
                        window.onload = () => {
                            window.print();
                            window.close();
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleSave = (order) => {
        const svgString = renderReceipt(order);
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        // Get dimensions
        const width = parseInt(svgElement.getAttribute('width')) || 400;
        const height = parseInt(svgElement.getAttribute('height')) || 600;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // Encode SVG to base64
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = width * 2;
            canvas.height = height * 2;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);

            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `receipt-order-${order.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    if (loading) return <div className="p-8 text-[#A0A0A0] animate-pulse font-medium">Loading bills...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-[#FFFFFF] mb-2 tracking-tighter">Bills & Payments</h1>
                    <p className="text-[#A0A0A0] font-medium">Track payments and generate receipts for completed orders</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Table..."
                        className="w-full bg-[#0A0A0A] border border-[#2F3336] rounded-2xl pl-12 pr-6 py-4 text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bills List */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-32 bg-[#0A0A0A] rounded-[40px] border-2 border-dashed border-[#2F3336]">
                            <FileText size={64} className="mx-auto mb-6 text-[#A0A0A0] opacity-20" />
                            <p className="text-[#A0A0A0] font-bold text-2xl">No completed orders yet.</p>
                            <p className="text-[#A0A0A0]/50 font-medium mt-2">Bills will appear here once orders are marked as completed.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`bg-[#0A0A0A] p-6 rounded-[32px] border transition-all duration-300 cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'border-[#FF5A1F] shadow-lg shadow-[#FF5A1F]/5' : 'border-[#2F3336] hover:border-[#71767B]'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl transition-colors ${selectedOrder?.id === order.id ? 'bg-[#FF5A1F]/20 text-[#FF5A1F]' : 'bg-[#16181C] text-[#A0A0A0] group-hover:text-[#FFFFFF]'}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#FFFFFF]">Order #{order.id}</h3>
                                        <p className="text-[#A0A0A0] font-medium text-sm">Table {order.table_number} • {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[#FF5A1F]">₹{order.total_price || order.items.reduce((s, i) => s + (i.quantity * (i.menu_item?.price || i.price || 0)), 0).toFixed(2)}</p>
                                    <p className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest mt-1">Paid</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bill Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0A0A0A] rounded-[40px] border border-[#2F3336] p-8 sticky top-8">
                        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8 tracking-tighter flex items-center gap-3">
                            <FileText className="text-[#FF5A1F]" size={24} />
                            Bill Preview
                        </h2>

                        {selectedOrder ? (
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl p-6 shadow-2xl overflow-hidden flex justify-center">
                                    <div
                                        className="w-full max-w-[300px]"
                                        dangerouslySetInnerHTML={{ __html: renderReceipt(selectedOrder) }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handlePrint(selectedOrder)}
                                        className="flex items-center justify-center gap-2 py-4 bg-[#FF5A1F] text-white rounded-full font-bold hover:bg-[#E44D15] transition-all active:scale-95 shadow-xl shadow-[#FF5A1F]/20"
                                    >
                                        <Printer size={20} />
                                        Print
                                    </button>
                                    <button
                                        onClick={() => handleSave(selectedOrder)}
                                        className="flex items-center justify-center gap-2 py-4 bg-[#16181C] text-[#FFFFFF] rounded-full font-bold border border-[#2F3336] hover:bg-[#2F3336] transition-all active:scale-95"
                                    >
                                        <Download size={20} />
                                        Save PNG
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-30">
                                <FileText size={48} className="mx-auto mb-4 text-[#A0A0A0]" />
                                <p className="text-[#A0A0A0] font-medium">Select an order to view its bill</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBillsPage;
