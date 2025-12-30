import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ totalItems, totalPrice, restaurantId, table }) => {
    const navigate = useNavigate();

    if (totalItems === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-[#2F3336] p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-50">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="bg-[#FF5A1F]/10 p-3 rounded-2xl relative">
                        <ShoppingBag className="text-[#FF5A1F]" size={24} />
                        <span className="absolute -top-2 -right-2 bg-[#FF5A1F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                            {totalItems}
                        </span>
                    </div>
                    <div>
                        <p className="text-[#A0A0A0] text-[10px] uppercase font-bold tracking-[0.2em] mb-0.5">Total Amount</p>
                        <p className="text-2xl font-bold text-[#FFFFFF]">₹{totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/checkout?restaurant_id=${restaurantId}&table=${table}`)}
                    className="bg-[#FF5A1F] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#FF5A1F]/20 hover:bg-[#E44D15] active:scale-95 transition-all flex items-center gap-3"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default CartSummary;
