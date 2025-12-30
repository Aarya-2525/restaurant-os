import React, { useEffect, useState } from 'react';
import { fetchMenu, updateMenuItem } from '../lib/api';
import MenuItem from '../components/MenuItem';
import { UtensilsCrossed, Camera, Trash2, AlertCircle } from 'lucide-react';

const AdminPreviewMenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);

    const loadMenu = async () => {
        try {
            // Hardcoded restaurant ID 1 for now, as per other admin pages
            const data = await fetchMenu(1);
            setMenu(data);
        } catch (err) {
            setError('Failed to load menu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMenu();
    }, []);

    const handleImageUpload = async (itemId, file) => {
        // file can be File object (upload) or null (remove)
        setUploadingId(itemId);

        try {
            const token = localStorage.getItem('adminToken');
            let data;

            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                data = formData;
            } else {
                // Remove image
                data = { image: null };
            }

            await updateMenuItem(token, itemId, data);
            loadMenu(); // Refresh to show new image
        } catch (err) {
            console.error(err);
            alert(`Failed to update image: ${err.message}`);
        } finally {
            setUploadingId(null);
        }
    };

    if (loading) return <div className="p-8 text-[#A0A0A0] animate-pulse font-medium">Loading preview...</div>;
    if (error) return <div className="p-8 text-red-500 font-bold flex items-center gap-3"><AlertCircle size={20} /> {error}</div>;

    return (
        <div className="min-h-screen bg-black pb-32 relative max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-xl p-8 sticky top-0 z-20 border-b border-[#2F3336] mb-12">
                <div className="flex items-center gap-6">
                    <div className="bg-[#FF5A1F]/10 p-4 rounded-[24px]">
                        <UtensilsCrossed className="text-[#FF5A1F]" size={32} />
                    </div>
                    <div>
                        <h1 className="font-bold text-3xl text-[#FFFFFF] tracking-tighter">Menu Preview</h1>
                        <p className="text-sm text-[#A0A0A0] font-bold uppercase tracking-widest">Customer View • Admin Mode</p>
                    </div>
                </div>
            </div>

            {/* Menu Categories */}
            <div className="px-6 space-y-16">
                {menu.map((category) => (
                    <div key={category.id}>
                        <h2 className="font-bold text-2xl text-[#FFFFFF] mb-8 uppercase tracking-[0.2em] flex items-center gap-6">
                            {category.name}
                            <div className="h-px bg-[#2F3336] flex-1"></div>
                        </h2>
                        <div className="space-y-8">
                            {category.items.map((item) => (
                                <div key={item.id} className="relative group">
                                    {/* Reuse Customer MenuItem Component */}
                                    <div className="bg-[#0A0A0A] rounded-[40px] border border-[#2F3336] overflow-hidden transition-all duration-500 hover:border-[#FF5A1F]/30 shadow-2xl">
                                        <MenuItem
                                            item={item}
                                            quantity={0}
                                            onAdd={() => { }}
                                            onRemove={() => { }}
                                        />
                                    </div>

                                    {/* Admin Overlay for Image Upload */}
                                    <div className="absolute top-6 right-6 z-20 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        {item.image && (
                                            <button
                                                onClick={() => handleImageUpload(item.id, null)}
                                                className="bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all shadow-2xl active:scale-95"
                                                title="Remove Image"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        )}
                                        <label className="cursor-pointer bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-[#FF5A1F]/30 text-[#FF5A1F] hover:bg-[#FF5A1F]/10 transition-all flex items-center gap-4 shadow-2xl active:scale-95">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(item.id, e.target.files[0])}
                                                disabled={uploadingId === item.id}
                                            />
                                            {uploadingId === item.id ? (
                                                <span className="w-6 h-6 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <Camera size={24} />
                                            )}
                                            <span className="text-xs font-bold uppercase tracking-widest pr-2">Edit Image</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPreviewMenuPage;
