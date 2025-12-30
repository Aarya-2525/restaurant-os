import React from 'react';
import { QrCode, Smartphone } from 'lucide-react';

const ScanQRPage = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-[#0A0A0A] p-12 rounded-[48px] border border-[#2F3336] shadow-2xl max-w-md w-full space-y-10 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5A1F] rounded-full blur-[100px] opacity-10"></div>

                {/* Branding */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-[#FFFFFF] mb-3 tracking-tighter">Welcome!</h1>
                    <p className="text-[#A0A0A0] font-medium leading-relaxed">Please scan the QR code on your table to view the menu and place an order.</p>
                </div>

                {/* Illustration */}
                <div className="relative flex justify-center py-10 z-10">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <QrCode size={240} className="text-[#FF5A1F]" />
                    </div>
                    <div className="relative bg-[#FF5A1F]/10 p-8 rounded-[32px] shadow-inner">
                        <Smartphone size={72} className="text-[#FF5A1F] animate-pulse" />
                    </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4 relative z-10">
                    {[
                        "Open your phone's camera",
                        "Point it at the QR code on your table",
                        "Click the link to view the menu"
                    ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-5 bg-black/50 p-5 rounded-2xl border border-[#2F3336] text-left group hover:border-[#FF5A1F]/30 transition-all">
                            <div className="bg-[#16181C] p-2 rounded-full shadow-inner font-bold text-[#FF5A1F] w-10 h-10 flex items-center justify-center shrink-0 border border-[#2F3336] group-hover:border-[#FF5A1F]/50 transition-all">
                                {idx + 1}
                            </div>
                            <p className="text-sm text-[#A0A0A0] font-medium group-hover:text-[#FFFFFF] transition-colors">{step}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-[#2F3336] relative z-10">
                    <p className="text-xs text-[#A0A0A0] font-bold uppercase tracking-[0.3em] opacity-40">Powered by Eagle Eyed</p>
                </div>
            </div>
        </div>
    );
};

export default ScanQRPage;
