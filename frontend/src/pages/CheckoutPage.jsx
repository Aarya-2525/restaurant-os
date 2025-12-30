import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { placeOrder } from '../lib/api';
import { ArrowLeft, Phone, CheckCircle, ShoppingBag, AlertCircle } from 'lucide-react';

const CheckoutPage = ({ cart, clearCart }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const restaurantId = searchParams.get('restaurant_id');
    const table = searchParams.get('table');

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cartItemsList = Object.values(cart);
    const totalPrice = cartItemsList.reduce((sum, item) => sum + (parseFloat(item.item.price) * item.quantity), 0);

    if (cartItemsList.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black p-8">
                <div className="bg-[#0A0A0A] p-12 rounded-[40px] border border-[#2F3336] text-center max-w-sm w-full shadow-2xl">
                    <div className="bg-[#FF5A1F]/10 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag className="text-[#FF5A1F]" size={40} />
                    </div>
                    <p className="text-[#FFFFFF] font-bold text-2xl mb-3 tracking-tighter">Your cart is empty</p>
                    <p className="text-[#A0A0A0] font-medium mb-10">Add some delicious items to your cart to proceed.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-[#FF5A1F] text-white py-5 rounded-full font-bold text-lg hover:bg-[#E44D15] transition-all active:scale-95 shadow-xl shadow-[#FF5A1F]/20"
                    >
                        Go back to menu
                    </button>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const orderData = {
            table_number: parseInt(table),
            items: cartItemsList.map(item => ({
                menu_item: item.item.id,
                quantity: item.quantity
            })),
        };

        try {
            const response = await placeOrder(restaurantId, orderData);
            clearCart();
            navigate(`/order-confirmed`, { state: { order: response } });
        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-[#FFFFFF] pb-32">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-xl p-8 flex items-center gap-6 sticky top-0 z-20 border-b border-[#2F3336]">
                <button onClick={() => navigate(-1)} className="text-[#FFFFFF] hover:bg-[#16181C] p-4 rounded-2xl transition-all active:scale-90">
                    <ArrowLeft size={28} />
                </button>
                <div>
                    <h1 className="font-bold text-3xl tracking-tighter">Checkout</h1>
                    <p className="text-xs text-[#A0A0A0] font-bold uppercase tracking-widest">Table {table}</p>
                </div>
            </div>

            <div className="p-8 max-w-2xl mx-auto space-y-12">
                {/* Order Summary */}
                <div className="bg-[#0A0A0A] rounded-[40px] border border-[#2F3336] p-10 shadow-2xl relative overflow-hidden group">
                    {/* Decorative glow */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF5A1F] rounded-full blur-[60px] opacity-10"></div>

                    <h2 className="font-bold text-2xl mb-10 flex items-center gap-4 tracking-tighter">
                        <div className="w-2 h-8 bg-[#FF5A1F] rounded-full shadow-lg shadow-[#FF5A1F]/50"></div>
                        Order Summary
                    </h2>
                    <div className="space-y-6 mb-10">
                        {cartItemsList.map(({ item, quantity }) => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div className="flex gap-5">
                                    <div className="bg-[#16181C] w-12 h-12 rounded-2xl flex items-center justify-center text-[#FF5A1F] font-bold shadow-inner">
                                        {quantity}x
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-bold text-[#FFFFFF] text-lg leading-tight">{item.name}</p>
                                        <p className="text-[#A0A0A0] text-sm font-medium mt-1">₹{parseFloat(item.price).toFixed(2)} each</p>
                                    </div>
                                </div>
                                <span className="font-bold text-[#FFFFFF] text-lg pt-1">
                                    ₹{(parseFloat(item.price) * quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#2F3336] pt-10 flex justify-between items-center">
                        <span className="font-bold text-sm uppercase tracking-[0.2em] text-[#A0A0A0]">Total Amount</span>
                        <span className="font-bold text-4xl text-[#FF5A1F] tracking-tighter">₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Customer Details */}
                <form onSubmit={handlePlaceOrder} className="bg-[#0A0A0A] rounded-[40px] border border-[#2F3336] p-10 shadow-2xl space-y-10">
                    <h2 className="font-bold text-2xl flex items-center gap-4 tracking-tighter">
                        <div className="w-2 h-8 bg-[#FF5A1F] rounded-full shadow-lg shadow-[#FF5A1F]/50"></div>
                        Your Details
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-[#A0A0A0] mb-4 uppercase tracking-[0.2em] ml-1">
                                Phone Number <span className="text-[#A0A0A0]/40 font-medium lowercase">(Optional)</span>
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A0A0A0] group-focus-within:text-[#FF5A1F] transition-colors" size={24} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="98765 43210"
                                    className="w-full bg-black pl-16 pr-8 py-5 border border-[#2F3336] rounded-[24px] text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium text-lg placeholder-[#A0A0A0]/20"
                                />
                            </div>
                            <p className="text-xs text-[#A0A0A0] mt-4 ml-1 font-medium">
                                We'll use this to contact you regarding your order.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl text-sm font-bold flex items-center gap-4">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF5A1F] text-white py-6 rounded-full font-bold text-2xl shadow-2xl shadow-[#FF5A1F]/30 hover:bg-[#E44D15] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-4"
                    >
                        {loading ? (
                            <span className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Confirm Order
                                <CheckCircle size={28} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
