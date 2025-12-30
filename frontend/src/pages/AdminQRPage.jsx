import React, { useEffect, useState } from 'react';
import { fetchTables, addTable, deleteTable, API_BASE_URL } from '../lib/api';
import { QrCode, Plus, Trash2, Download, Printer, AlertCircle } from 'lucide-react';

const AdminQRPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTableNumber, setNewTableNumber] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const data = await fetchTables();
            setTables(data);
        } catch (err) {
            console.error('Failed to load tables');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        if (!newTableNumber) return;

        setAdding(true);
        setError('');
        try {
            await addTable(newTableNumber);
            setNewTableNumber('');
            loadTables();
        } catch (err) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;
        try {
            await deleteTable(id);
            loadTables();
        } catch (err) {
            alert('Failed to delete table');
        }
    };

    const getQrUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    };

    const handlePrint = (qrUrl, tableNumber) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>Table ${tableNumber} QR Code</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: 'Inter', sans-serif; }
            img { max-width: 300px; }
            h1 { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Table ${tableNumber}</h1>
          <img src="${qrUrl}" onload="window.print();window.close()" />
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    if (loading) return <div className="p-8 text-[#A0A0A0] animate-pulse font-medium">Loading tables...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-5">
                    <div className="bg-[#FF5A1F]/10 p-4 rounded-[24px]">
                        <QrCode className="text-[#FF5A1F]" size={40} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-[#FFFFFF] tracking-tighter">QR Codes</h1>
                        <p className="text-[#A0A0A0] font-medium">Manage tables and generate QR codes</p>
                    </div>
                </div>

                <form onSubmit={handleAddTable} className="flex gap-3 w-full md:w-auto">
                    <input
                        type="number"
                        placeholder="Table No."
                        className="bg-black border border-[#2F3336] rounded-2xl px-6 py-4 w-full md:w-32 text-[#FFFFFF] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] outline-none transition-all font-medium placeholder-[#A0A0A0]/30"
                        value={newTableNumber}
                        onChange={(e) => setNewTableNumber(e.target.value)}
                        required
                        min="1"
                    />
                    <button
                        type="submit"
                        disabled={adding}
                        className="bg-[#FF5A1F] text-white px-10 py-4 rounded-full font-bold hover:bg-[#E44D15] disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-[#FF5A1F]/20"
                    >
                        <Plus size={20} />
                        {adding ? 'Adding...' : 'Add Table'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-10 font-bold text-sm flex items-center gap-4">
                    <AlertCircle size={24} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {tables.map((table) => (
                    <div key={table.id} className="bg-[#0A0A0A] p-10 rounded-[40px] border border-[#2F3336] flex flex-col items-center text-center transition-all duration-500 hover:border-[#FF5A1F]/30 group relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF5A1F] rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                        <div className="text-3xl font-bold text-[#FFFFFF] mb-8 tracking-tighter">Table {table.number}</div>

                        <div className="bg-white p-6 rounded-[32px] mb-10 group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl shadow-black/50">
                            <img
                                src={getQrUrl(table.qr_code)}
                                alt={`QR for Table ${table.number}`}
                                className="w-48 h-48 object-contain"
                            />
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex gap-4">
                                <a
                                    href={getQrUrl(table.qr_code)}
                                    download={`table-${table.number}-qr.png`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#16181C] text-[#FFFFFF] py-4 rounded-full hover:bg-[#2F3336] transition-all text-sm font-bold border border-[#2F3336] active:scale-95"
                                >
                                    <Download size={18} />
                                    Save
                                </a>
                                <button
                                    onClick={() => handlePrint(getQrUrl(table.qr_code), table.number)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#16181C] text-[#FFFFFF] py-4 rounded-full hover:bg-[#2F3336] transition-all text-sm font-bold border border-[#2F3336] active:scale-95"
                                >
                                    <Printer size={18} />
                                    Print
                                </button>
                            </div>
                            <button
                                onClick={() => handleDeleteTable(table.id)}
                                className="w-full flex items-center justify-center gap-2 py-4 text-red-500 hover:bg-red-500/10 rounded-full transition-all text-sm font-bold border border-transparent hover:border-red-500/20 active:scale-95"
                                title="Delete Table"
                            >
                                <Trash2 size={18} />
                                Delete Table
                            </button>
                        </div>
                    </div>
                ))}

                {tables.length === 0 && (
                    <div className="col-span-full text-center py-32 bg-[#0A0A0A] rounded-[40px] border-2 border-dashed border-[#2F3336]">
                        <QrCode size={80} className="mx-auto mb-8 text-[#A0A0A0] opacity-20" />
                        <p className="text-[#A0A0A0] font-bold text-2xl">No tables added yet.</p>
                        <p className="text-[#A0A0A0]/50 font-medium mt-2">Add a table above to generate its unique QR code.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminQRPage;
