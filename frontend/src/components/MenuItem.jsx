import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

const MenuItem = ({ item, quantity, onAdd, onRemove }) => {

    // Helper to construct full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    return (
        <div className="bg-[#0A0A0A] p-5 rounded-3xl border border-[#2F3336] flex justify-between items-center gap-6 transition-all duration-300 hover:border-[#FF5A1F]/30 group">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    {item.is_veg ? (
                        <div className="w-5 h-5 border-2 border-green-500/50 flex items-center justify-center p-[3px] flex-shrink-0 rounded-sm">
                            <div className="w-full h-full bg-green-500 rounded-full"></div>
                        </div>
                    ) : (
                        <div className="w-5 h-5 border-2 border-red-500/50 flex items-center justify-center p-[3px] flex-shrink-0 rounded-sm">
                            <div className="w-full h-full bg-red-500 rounded-full"></div>
                        </div>
                    )}
                    <h3 className="font-bold text-xl text-[#FFFFFF] leading-tight truncate">{item.name}</h3>
                </div>

                <p className="text-[#A0A0A0] text-sm mb-4 line-clamp-2 font-medium">{item.description}</p>

                <div className="flex items-center gap-4">
                    <p className="font-bold text-2xl text-[#FFFFFF]">₹{item.price}</p>
                    <div className="flex gap-2">
                        {item.is_chefs_special && (
                            <span className="bg-[#FF5A1F]/10 text-[#FF5A1F] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                Chef's Special
                            </span>
                        )}
                        {item.is_jain && (
                            <span className="bg-green-500/10 text-green-500 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                Jain
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                {/* Image if available */}
                {item.image && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-[#16181C] border border-[#2F3336] group-hover:border-[#FF5A1F]/30 transition-all">
                        <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                )}

                {quantity > 0 ? (
                    <div className="flex items-center bg-black rounded-full border border-[#2F3336] overflow-hidden shadow-xl">
                        <button
                            onClick={() => onRemove(item)}
                            className="p-3 text-[#FF5A1F] hover:bg-[#FF5A1F]/10 active:scale-90 transition-all"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-8 text-center font-bold text-[#FFFFFF] text-lg">{quantity}</span>
                        <button
                            onClick={() => onAdd(item)}
                            className="p-3 text-[#FF5A1F] hover:bg-[#FF5A1F]/10 active:scale-90 transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onAdd(item)}
                        className="bg-[#FF5A1F] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#FF5A1F]/20 hover:bg-[#E44D15] active:scale-95 transition-all uppercase text-xs tracking-widest"
                    >
                        Add
                    </button>
                )}
            </div>
        </div>
    );
};

export default MenuItem;
