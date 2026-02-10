"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartUploadProps {
    onUpload: (file: File) => void;
    isAnalyzing: boolean;
}

export const ChartUpload: React.FC<ChartUploadProps> = ({
    onUpload,
    isAnalyzing,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                handleFileSelect(file);
            }
        },
        [onUpload]
    );

    const handleFileSelect = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onUpload(file);
    };

    const clearPreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out cursor-pointer group",
                    isDragging
                        ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                        : "border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/50",
                    preview ? "border-transparent" : ""
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isAnalyzing}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                    }}
                />

                {preview ? (
                    <div className="relative rounded-lg overflow-hidden shadow-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Chart Preview"
                            className="w-full h-auto max-h-[500px] object-contain"
                        />
                        {!isAnalyzing && (
                            <button
                                onClick={clearPreview}
                                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors z-20"
                            >
                                <X size={20} />
                            </button>
                        )}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                                <p className="text-emerald-400 font-mono text-lg animate-pulse">
                                    ANALYZING CHART DATA...
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                        <div className="mb-6 p-4 rounded-full bg-slate-800/80 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                            <Upload className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">
                            Upload Stock Chart
                        </h3>
                        <p className="text-sm text-slate-500 text-center max-w-xs">
                            Drag and drop your technical chart here, or click to browse.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-950/50 px-3 py-1.5 rounded-md border border-slate-800">
                            <ImageIcon size={14} />
                            <span>SUPPORTS JPG, PNG, WEBP</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
