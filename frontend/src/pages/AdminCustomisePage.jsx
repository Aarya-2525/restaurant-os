import React, { useEffect, useState } from 'react';
import { fetchRestaurantSettings, updateRestaurantSettings } from '../lib/api';
import { Palette, Save, Moon, Sun } from 'lucide-react';

const AdminCustomisePage = () => {
    const [settings, setSettings] = useState({
        primary_color: '#2563eb',
        secondary_color: '#1e40af',
        background_color: '#ffffff',
        font_choice: 'Inter'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    // Apply changes in real-time for preview (Global app changes)
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', settings.primary_color);
        root.style.setProperty('--secondary-color', settings.secondary_color);
        root.style.setProperty('--background-color', settings.background_color);

        // Note: This toggles "dark" class on the actual admin page too, which is good for previewing
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings, darkMode]);

    const loadSettings = async () => {
        try {
            const data = await fetchRestaurantSettings();
            setSettings(data);
        } catch (err) {
            console.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await updateRestaurantSettings(settings);
            setMessage('Settings saved successfully!');
        } catch (err) {
            console.error(err);
            setMessage(`Failed to save settings: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    // Derived colors for preview based on Dark Mode
    // If Dark Mode is ON, we override the background/text colors for the preview phone
    // regardless of what the user selected for "Background Color" (which is usually for Light Mode)
    const previewBg = darkMode ? '#111827' : settings.background_color;
    const previewText = darkMode ? '#f3f4f6' : '#1f2937';
    const previewCardBg = darkMode ? '#1f2937' : '#ffffff';
    const previewCardText = darkMode ? '#e5e7eb' : '#374151';
    const previewBorder = darkMode ? '#374151' : '#e5e7eb';

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-pink-100 p-2 rounded-lg">
                    <Palette className="text-pink-600" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customise Theme</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your restaurant's branding and appearance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Settings Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6 transition-colors">
                    <h2 className="font-semibold text-lg border-b pb-2 dark:text-white dark:border-gray-700">Color Palette</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.primary_color}
                                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                className="h-10 w-20 rounded cursor-pointer"
                            />
                            <span className="text-gray-500 dark:text-gray-400 font-mono">{settings.primary_color}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Used for buttons, highlights, and active states.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.secondary_color}
                                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                                className="h-10 w-20 rounded cursor-pointer"
                            />
                            <span className="text-gray-500 dark:text-gray-400 font-mono">{settings.secondary_color}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Used for headers, footers, and accents.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Color (Light Mode)</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.background_color}
                                onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                                className="h-10 w-20 rounded cursor-pointer"
                            />
                            <span className="text-gray-500 dark:text-gray-400 font-mono">{settings.background_color}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Main background color for the app in light mode.</p>
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode Preview</span>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Toggle to see how your colors look in dark mode.</p>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 w-full justify-center"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {message && (
                            <p className={`text-center mt-3 text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                    <h2 className="font-semibold text-lg text-gray-600 dark:text-gray-400">Live Preview</h2>

                    {/* Mock Phone UI */}
                    <div className="border-8 border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl bg-white max-w-xs mx-auto" style={{ height: '600px' }}>
                        <div className="h-full flex flex-col transition-colors duration-300" style={{ backgroundColor: previewBg, color: previewText }}>
                            {/* Header */}
                            <div className="p-4 text-white transition-colors duration-300" style={{ backgroundColor: settings.primary_color }}>
                                <div className="font-bold text-lg">Veronica's Bombay</div>
                                <div className="text-xs opacity-80">Table 5</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                <div className="p-3 rounded-lg shadow-sm transition-colors duration-300" style={{ backgroundColor: previewCardBg }}>
                                    <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
                                    <div className="font-bold" style={{ color: previewCardText }}>Butter Chicken</div>
                                    <div className="text-xs opacity-70">Delicious creamy curry...</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold" style={{ color: settings.secondary_color }}>₹450</span>
                                        <button className="text-white px-3 py-1 rounded text-xs transition-colors duration-300" style={{ backgroundColor: settings.primary_color }}>ADD</button>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg shadow-sm transition-colors duration-300" style={{ backgroundColor: previewCardBg }}>
                                    <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
                                    <div className="font-bold" style={{ color: previewCardText }}>Garlic Naan</div>
                                    <div className="text-xs opacity-70">Freshly baked...</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold" style={{ color: settings.secondary_color }}>₹60</span>
                                        <button className="text-white px-3 py-1 rounded text-xs transition-colors duration-300" style={{ backgroundColor: settings.primary_color }}>ADD</button>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Bar */}
                            <div className="p-4 border-t transition-colors duration-300" style={{ backgroundColor: previewCardBg, borderColor: previewBorder }}>
                                <button className="w-full text-white py-3 rounded-xl font-bold shadow-lg flex justify-between px-6 transition-colors duration-300" style={{ backgroundColor: settings.primary_color }}>
                                    <span>2 Items</span>
                                    <span>View Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomisePage;
