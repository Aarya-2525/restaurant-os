import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMenu } from '../lib/api';
import MenuItem from '../components/MenuItem';
import CartSummary from '../components/CartSummary';
import { UtensilsCrossed, AlertCircle, RefreshCw } from 'lucide-react';

const MenuPage = ({ cart, addToCart, removeFromCart }) => {
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurant_id');
    const table = searchParams.get('table');

    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!restaurantId) {
            setError('Missing restaurant ID');
            setLoading(false);
            return;
        }

        const loadMenu = async () => {
            try {
                const data = await fetchMenu(restaurantId);
                setMenu(data);
            } catch (err) {
                setError('Failed to load menu. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, [restaurantId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#FF5A1F]/20"></div>
                    <p className="text-[#A0A0A0] font-bold uppercase tracking-[0.2em] text-xs">Loading Menu</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-8">
                <div className="text-center bg-[#0A0A0A] p-12 rounded-[40px] border border-[#2F3336] shadow-2xl max-w-sm">
                    <div className="bg-red-500/10 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-500" size={40} />
                    </div>
                    <p className="text-[#FFFFFF] font-bold text-2xl mb-3 tracking-tighter">Oops!</p>
                    <p className="text-[#A0A0A0] font-medium mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-[#FF5A1F] text-white py-4 rounded-full font-bold hover:bg-[#E44D15] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-[#FF5A1F]/20"
                    >
                        <RefreshCw size={20} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Calculate cart totals
    const cartItemsList = Object.values(cart);
    const totalItems = cartItemsList.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItemsList.reduce((sum, item) => sum + (parseFloat(item.item.price) * item.quantity), 0);

    return (
        <div className="min-h-screen bg-black pb-32 max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-xl p-8 sticky top-0 z-20 border-b border-[#2F3336]">
                <div className="flex items-center gap-6">
                    <div className="bg-[#FF5A1F]/10 p-4 rounded-[24px]">
                        <UtensilsCrossed className="text-[#FF5A1F]" size={32} />
                    </div>
                    <div>
                        <h1 className="font-bold text-3xl text-[#FFFFFF] tracking-tighter">Menu</h1>
                        <p className="text-sm text-[#A0A0A0] font-bold uppercase tracking-widest">Table {table}</p>
                    </div>
                </div>
            </div>

            {/* Menu Categories */}
            <div className="p-8 space-y-16">
                {menu.map((category) => (
                    <div key={category.id}>
                        <h2 className="font-bold text-2xl text-[#FFFFFF] mb-8 uppercase tracking-[0.2em] flex items-center gap-6">
                            {category.name}
                            <div className="h-px bg-[#2F3336] flex-1"></div>
                        </h2>
                        <div className="space-y-8">
                            {category.items.map((item) => (
                                <div key={item.id} className="bg-[#0A0A0A] rounded-[40px] border border-[#2F3336] overflow-hidden transition-all duration-500 hover:border-[#FF5A1F]/30 shadow-2xl">
                                    <MenuItem
                                        item={item}
                                        quantity={cart[item.id]?.quantity || 0}
                                        onAdd={addToCart}
                                        onRemove={removeFromCart}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <CartSummary
                totalItems={totalItems}
                totalPrice={totalPrice}
                restaurantId={restaurantId}
                table={table}
            />
        </div>
    );
};

export default MenuPage;
