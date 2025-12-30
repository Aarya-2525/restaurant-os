import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../lib/api';
import { ChefHat } from 'lucide-react';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // loginAdmin now handles token storage (access & refresh)
            await loginAdmin(username, password);
            navigate('/admin/orders');
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="bg-[#0A0A0A] p-12 rounded-[40px] border border-[#2F3336] shadow-2xl max-w-md w-full relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5A1F] rounded-full blur-[100px] opacity-10"></div>

                <div className="relative z-10">
                    <div className="flex justify-center mb-10">
                        <div className="bg-[#FF5A1F]/10 p-5 rounded-[24px]">
                            <ChefHat size={56} className="text-[#FF5A1F]" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-center text-[#FFFFFF] mb-3 tracking-tighter">Staff Login</h1>
                    <p className="text-center text-[#A0A0A0] font-medium mb-12">Access the restaurant dashboard</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-sm text-center font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#A0A0A0] mb-2.5 ml-1 uppercase tracking-widest">Username</label>
                            <input
                                type="text"
                                className="w-full bg-black border border-[#2F3336] px-6 py-4.5 rounded-2xl text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#A0A0A0] mb-2.5 ml-1 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                className="w-full bg-black border border-[#2F3336] px-6 py-4.5 rounded-2xl text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF5A1F] text-white py-5 rounded-full font-bold text-xl hover:bg-[#E44D15] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[#FF5A1F]/20 mt-6"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
