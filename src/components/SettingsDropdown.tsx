"use client";

import React, { useState, useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
    Settings,
    Moon,
    Sun,
    User,
    Bell,
    Globe,
    HelpCircle,
    LogOut,
    ChevronRight,
    Check
} from "lucide-react";

export const SettingsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [notifications, setNotifications] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { signOut, openUserProfile } = useClerk();
    const { user } = useUser();

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("vantix_theme") as "dark" | "light" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("light", savedTheme === "light");
        }

        const savedNotifications = localStorage.getItem("vantix_notifications");
        if (savedNotifications !== null) {
            setNotifications(savedNotifications === "true");
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("vantix_theme", newTheme);
        document.documentElement.classList.toggle("light", newTheme === "light");
    };

    const toggleNotifications = () => {
        const newValue = !notifications;
        setNotifications(newValue);
        localStorage.setItem("vantix_notifications", String(newValue));
    };

    const handleSignOut = () => {
        signOut({ redirectUrl: "/sign-in" });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${isOpen
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                title="Settings"
            >
                <Settings size={18} className={isOpen ? "animate-spin-slow" : ""} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* User Info Header */}
                    <div className="p-4 bg-slate-950/50 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">
                                    {user?.fullName || user?.emailAddresses?.[0]?.emailAddress || "User"}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {user?.emailAddresses?.[0]?.emailAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        {/* Account */}
                        <button
                            onClick={() => { openUserProfile(); setIsOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <User size={16} className="text-slate-500 group-hover:text-emerald-400" />
                                <span className="text-sm">Account</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-600" />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                {theme === "dark" ? (
                                    <Moon size={16} className="text-slate-500 group-hover:text-blue-400" />
                                ) : (
                                    <Sun size={16} className="text-slate-500 group-hover:text-amber-400" />
                                )}
                                <span className="text-sm">Theme</span>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                {theme === "dark" ? "Dark" : "Light"}
                            </span>
                        </button>

                        {/* Notifications */}
                        <button
                            onClick={toggleNotifications}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Bell size={16} className="text-slate-500 group-hover:text-emerald-400" />
                                <span className="text-sm">Notifications</span>
                            </div>
                            <div className={`w-8 h-5 rounded-full transition-colors ${notifications ? "bg-emerald-500" : "bg-slate-700"} flex items-center ${notifications ? "justify-end" : "justify-start"} px-0.5`}>
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </button>

                        {/* Language */}
                        <button
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Globe size={16} className="text-slate-500 group-hover:text-emerald-400" />
                                <span className="text-sm">Language</span>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">English</span>
                        </button>

                        <div className="my-2 border-t border-slate-800"></div>

                        {/* Help */}
                        <button
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <HelpCircle size={16} className="text-slate-500 group-hover:text-emerald-400" />
                                <span className="text-sm">Help & Support</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-600" />
                        </button>

                        <div className="my-2 border-t border-slate-800"></div>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors group"
                        >
                            <LogOut size={16} />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
