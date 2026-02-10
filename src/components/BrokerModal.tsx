"use client";

import React from "react";
import { X } from "lucide-react";
import { ConnectBroker } from "./ConnectBroker";

interface BrokerModalProps {
    isOpen: boolean;
    onClose: () => void;
    isConnected: boolean;
}

export const BrokerModal: React.FC<BrokerModalProps> = ({ isOpen, onClose, isConnected }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Trading Integration</h2>
                    <ConnectBroker isConnected={isConnected} />
                </div>
            </div>
        </div>
    );
};
