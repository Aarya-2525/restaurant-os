import React, { useState } from 'react';
import { addMenuItem, uploadMenuCSV } from '../lib/api';
import { Upload, Plus, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const AdminMenuPage = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category: 1, // Default to 1, ideally fetch categories
        cooking_time_minutes: 10,
        is_veg: true,
        is_non_veg: false,
        is_jain: false,
        is_chefs_special: false
    });
    const [imageFile, setImageFile] = useState(null);

    const handleAddItem = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('adminToken');

            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('description', newItem.description);
            formData.append('price', newItem.price);
            formData.append('category', newItem.category);
            formData.append('cooking_time_minutes', newItem.cooking_time_minutes);
            formData.append('is_veg', newItem.is_veg);
            formData.append('is_non_veg', newItem.is_non_veg);
            formData.append('is_jain', newItem.is_jain);
            formData.append('is_chefs_special', newItem.is_chefs_special);
            formData.append('restaurant', 1); // Hardcoded for now as per previous logic

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await addMenuItem(token, formData);
            setMessage('Item added successfully!');
            setNewItem({
                ...newItem,
                name: '',
                description: '',
                price: '',
                is_veg: true,
                is_non_veg: false,
                is_jain: false,
                is_chefs_special: false
            });
            setImageFile(null);
        } catch (err) {
            setMessage('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('adminToken');
            const res = await uploadMenuCSV(token, file);
            setMessage(res.message);
        } catch (err) {
            setMessage('Failed to upload CSV');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-[#FFFFFF] mb-3">Menu Management</h1>
                <p className="text-[#A0A0A0] font-medium">Add items or bulk upload your restaurant menu</p>
            </div>

            <div className="bg-[#0A0A0A] rounded-[40px] border border-[#2F3336] overflow-hidden shadow-2xl">
                <div className="flex border-b border-[#2F3336] p-2">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded-3xl ${activeTab === 'add' ? 'text-[#FF5A1F] bg-[#FF5A1F]/10' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        Add Single Item
                    </button>
                    <button
                        onClick={() => setActiveTab('csv')}
                        className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded-3xl ${activeTab === 'csv' ? 'text-[#FF5A1F] bg-[#FF5A1F]/10' : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#16181C]'}`}
                    >
                        Bulk Upload
                    </button>
                </div>

                <div className="p-10">
                    {message && (
                        <div className={`p-5 rounded-2xl mb-10 font-bold text-sm flex items-center justify-center gap-3 ${message.includes('Failed') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                            {message.includes('Failed') ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            {message}
                        </div>
                    )}

                    {activeTab === 'add' ? (
                        <form onSubmit={handleAddItem} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[#A0A0A0] mb-3 uppercase tracking-[0.2em] ml-1">Item Name</label>
                                    <input
                                        className="w-full bg-black border border-[#2F3336] px-6 py-4.5 rounded-2xl text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                                        placeholder="e.g. Truffle Pasta"
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-[#A0A0A0] mb-3 uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        className="w-full bg-black border border-[#2F3336] px-6 py-4.5 rounded-2xl text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30 min-h-[120px]"
                                        placeholder="Describe the dish..."
                                        value={newItem.description}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#A0A0A0] mb-3 uppercase tracking-[0.2em] ml-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black border border-[#2F3336] px-6 py-4.5 rounded-2xl text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#A0A0A0] mb-3 uppercase tracking-[0.2em] ml-1">Cooking Time (mins)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black border border-[#2F3336] px-6 py-4.5 rounded-2xl text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                                        value={newItem.cooking_time_minutes}
                                        onChange={e => setNewItem({ ...newItem, cooking_time_minutes: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#A0A0A0] mb-3 uppercase tracking-[0.2em] ml-1">Item Image</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files[0])}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 bg-black border-2 border-dashed border-[#2F3336] rounded-2xl cursor-pointer hover:border-[#FF5A1F]/50 transition-all group-hover:bg-[#FF5A1F]/5"
                                    >
                                        <Upload className="text-[#A0A0A0] mb-2 group-hover:text-[#FF5A1F] transition-colors" size={24} />
                                        <span className="text-xs font-bold text-[#A0A0A0] group-hover:text-[#FF5A1F] transition-colors uppercase tracking-widest">
                                            {imageFile ? imageFile.name : 'Upload Image'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-8 flex-wrap bg-black/50 p-6 rounded-3xl border border-[#2F3336]">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded-md border-2 border-[#2F3336] bg-black text-[#FF5A1F] focus:ring-[#FF5A1F] transition-all"
                                        checked={newItem.is_veg}
                                        onChange={e => {
                                            setNewItem({
                                                ...newItem,
                                                is_veg: e.target.checked,
                                                is_non_veg: !e.target.checked
                                            });
                                        }}
                                    />
                                    <span className="text-sm font-bold text-[#FFFFFF] uppercase tracking-widest">Veg</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded-md border-2 border-[#2F3336] bg-black text-[#FF5A1F] focus:ring-[#FF5A1F] transition-all"
                                        checked={newItem.is_non_veg}
                                        onChange={e => {
                                            setNewItem({
                                                ...newItem,
                                                is_non_veg: e.target.checked,
                                                is_veg: !e.target.checked
                                            });
                                        }}
                                    />
                                    <span className="text-sm font-bold text-[#FFFFFF] uppercase tracking-widest">Non-Veg</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded-md border-2 border-[#2F3336] bg-black text-[#FF5A1F] focus:ring-[#FF5A1F] transition-all"
                                        checked={newItem.is_jain}
                                        onChange={e => setNewItem({ ...newItem, is_jain: e.target.checked })}
                                    />
                                    <span className="text-sm font-bold text-[#FFFFFF] uppercase tracking-widest">Jain</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded-md border-2 border-[#2F3336] bg-black text-[#FF5A1F] focus:ring-[#FF5A1F] transition-all"
                                        checked={newItem.is_chefs_special}
                                        onChange={e => setNewItem({ ...newItem, is_chefs_special: e.target.checked })}
                                    />
                                    <span className="text-sm font-bold text-[#FFFFFF] uppercase tracking-widest">Chef's Special</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FF5A1F] text-white py-5 rounded-full font-bold text-xl hover:bg-[#E44D15] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[#FF5A1F]/20"
                            >
                                {loading ? 'Adding Item...' : 'Add to Menu'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-20 bg-black rounded-[40px] border-2 border-dashed border-[#2F3336] hover:border-[#FF5A1F]/50 transition-all group">
                            <div className="bg-[#FF5A1F]/10 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Upload className="text-[#FF5A1F]" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#FFFFFF] mb-3">Bulk Upload Menu</h3>
                            <p className="text-[#A0A0A0] font-medium mb-10 max-w-xs mx-auto">Select a CSV file to import multiple items at once.</p>

                            <div className="max-w-xs mx-auto">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCSVUpload}
                                    className="hidden"
                                    id="csv-upload"
                                />
                                <label
                                    htmlFor="csv-upload"
                                    className="inline-flex items-center gap-3 bg-[#16181C] text-[#FFFFFF] px-10 py-4 rounded-full font-bold hover:bg-[#2F3336] transition-all cursor-pointer border border-[#2F3336] active:scale-95"
                                >
                                    <FileText size={20} />
                                    Select CSV File
                                </label>
                            </div>

                            <div className="mt-12 space-y-3 bg-[#16181C]/50 p-6 rounded-3xl border border-[#2F3336] max-w-lg mx-auto">
                                <p className="text-xs text-[#A0A0A0] font-bold uppercase tracking-widest">Required Format</p>
                                <p className="text-xs text-[#FFFFFF] font-medium leading-relaxed">
                                    category, name, description, price, is_veg, is_jain, is_chefs_special, cooking_time_minutes
                                </p>
                                <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-wider mt-2">
                                    Note: CSV upload does not support Images currently.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMenuPage;
