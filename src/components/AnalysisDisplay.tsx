"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface AnalysisDisplayProps {
    analysis: string;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
    analysis,
}) => {
    if (!analysis) return null;

    return (
        <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden p-8">
                <div className="prose prose-invert prose-emerald max-w-none">
                    <ReactMarkdown
                        components={{
                            // Custom components to style the markdown specifically for financial data
                            h1: ({ node, ...props }) => (
                                <h1
                                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 border-b border-slate-700 pb-4"
                                    {...props}
                                />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2
                                    className="text-xl font-semibold text-slate-100 mt-8 mb-4 flex items-center gap-2"
                                    {...props}
                                />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong className="font-bold text-emerald-300" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li className="text-slate-300 my-1" {...props} />
                            ),
                        }}
                    >
                        {analysis}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
