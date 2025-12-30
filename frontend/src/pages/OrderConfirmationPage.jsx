import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock, Home, Loader2, ChefHat, FileText, Printer, X, Download } from 'lucide-react';
import { fetchOrderStatus } from '../lib/api';
import { generateReceiptText } from '../lib/receipt';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const initialOrder = location.state?.order;
    const [order, setOrder] = useState(initialOrder);
    const [showBill, setShowBill] = useState(false);

    useEffect(() => {
        if (!initialOrder) return;

        const pollInterval = setInterval(async () => {
            try {
                const updatedOrder = await fetchOrderStatus(initialOrder.restaurant, initialOrder.id);
                setOrder(updatedOrder);

                // Stop polling if completed or cancelled
                if (updatedOrder.status === 'completed' || updatedOrder.status === 'cancelled') {
                    clearInterval(pollInterval);
                }
            } catch (err) {
                console.error('Failed to poll order status:', err);
            }
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [initialOrder]);

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
                <div className="bg-[#0A0A0A] p-10 rounded-3xl border border-[#2F3336] text-center max-w-sm w-full">
                    <p className="text-[#A0A0A0] font-medium text-lg mb-6">No order details found</p>
                    <Link to="/" className="w-full inline-block bg-[#1D9BF0] text-white py-4 rounded-full font-medium text-lg hover:bg-[#1A8CD8] transition-all active:scale-95 shadow-lg shadow-[#1D9BF0]/20">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const isCompleted = order.status === 'completed';

    const renderReceipt = () => {
        const text = generateReceiptText(order);
        if (window.receiptline) {
            return window.receiptline.transform(text, { cpl: 32, encoding: 'cp437' });
        }
        return `<pre style="color: black; font-family: monospace;">${text}</pre>`;
    };

    const handlePrint = () => {
        const svg = renderReceipt();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt - Order #${order.id}</title>
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

    const handleSave = () => {
        const svgString = renderReceipt();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        const width = parseInt(svgElement.getAttribute('width')) || 400;
        const height = parseInt(svgElement.getAttribute('height')) || 600;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

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

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-[#0A0A0A] p-12 rounded-[48px] border border-[#2F3336] shadow-2xl max-w-md w-full relative overflow-hidden">
                {/* Decorative background glow */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-20 ${isCompleted ? 'bg-green-500' : 'bg-[#FF5A1F]'}`}></div>

                <div className={`w-24 h-24 ${isCompleted ? 'bg-green-500/10' : 'bg-[#FF5A1F]/10'} rounded-[32px] flex items-center justify-center mx-auto mb-10 relative z-10 shadow-inner`}>
                    {isCompleted ? (
                        <ChefHat className="text-green-500" size={48} />
                    ) : (
                        <div className="relative">
                            <Clock className="text-[#FF5A1F]" size={48} />
                            <div className="absolute inset-0 text-[#FF5A1F] animate-ping opacity-20">
                                <Clock size={48} />
                            </div>
                        </div>
                    )}
                </div>

                <h1 className="text-4xl font-bold text-[#FFFFFF] mb-4 relative z-10 tracking-tighter">
                    {isCompleted ? 'Order Ready!' : 'Order Placed!'}
                </h1>
                <p className="text-[#A0A0A0] font-medium text-lg mb-12 relative z-10 leading-relaxed">
                    {isCompleted
                        ? 'Your delicious meal is ready and will be served shortly.'
                        : "Sit back and relax. Our kitchen team is already crafting your meal."}
                </p>

                <div className="bg-black rounded-[32px] p-10 mb-12 border border-[#2F3336] relative z-10 shadow-inner">
                    <p className="text-xs text-[#A0A0A0] uppercase tracking-[0.3em] font-bold mb-3">Order ID</p>
                    <p className="text-4xl font-bold text-[#FFFFFF] mb-8 tracking-tighter">#{order.id}</p>

                    <div className={`flex items-center justify-center gap-4 ${isCompleted ? 'text-green-500 bg-green-500/10' : 'text-[#FF5A1F] bg-[#FF5A1F]/10'} py-4 px-8 rounded-2xl transition-all duration-500 shadow-sm`}>
                        {isCompleted ? (
                            <CheckCircle size={24} />
                        ) : (
                            <Loader2 size={24} className="animate-spin" />
                        )}
                        <span className="font-bold text-sm uppercase tracking-widest">
                            {isCompleted ? 'Ready to Serve' : `~${order.estimated_wait_time || 15} mins`}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                    {isCompleted && (
                        <button
                            onClick={() => setShowBill(true)}
                            className="flex items-center justify-center gap-4 bg-[#FF5A1F]/10 text-[#FF5A1F] hover:bg-[#FF5A1F]/20 font-bold py-5 rounded-full transition-all border border-[#FF5A1F]/20 active:scale-95"
                        >
                            <FileText size={24} />
                            View Digital Receipt
                        </button>
                    )}
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-4 bg-[#16181C] text-[#FFFFFF] hover:bg-[#2F3336] font-bold py-5 rounded-full transition-all border border-[#2F3336] active:scale-95 shadow-xl"
                    >
                        <Home size={24} />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Bill Modal */}
            {showBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] w-full max-w-sm rounded-[40px] border border-[#2F3336] p-8 relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowBill(false)}
                            className="absolute top-6 right-6 text-[#A0A0A0] hover:text-[#FFFFFF] p-2"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8 text-left tracking-tighter">Digital Receipt</h2>

                        <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl overflow-hidden flex justify-center">
                            <div
                                className="w-full"
                                dangerouslySetInnerHTML={{ __html: renderReceipt() }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-3 py-5 bg-[#FF5A1F] text-white rounded-full font-bold text-lg hover:bg-[#E44D15] transition-all active:scale-95 shadow-xl shadow-[#FF5A1F]/20"
                            >
                                <Printer size={24} />
                                Print
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center gap-3 py-5 bg-[#16181C] text-[#FFFFFF] rounded-full font-bold text-lg border border-[#2F3336] hover:bg-[#2F3336] transition-all active:scale-95"
                            >
                                <Download size={24} />
                                Save PNG
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderConfirmationPage;
