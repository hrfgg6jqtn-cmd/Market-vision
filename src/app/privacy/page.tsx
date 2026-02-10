'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
    const router = useRouter();

    const handleAccept = () => {
        localStorage.setItem('privacyAccepted', 'true');
        localStorage.setItem('privacyAcceptedDate', new Date().toISOString());
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8 border-b pb-4">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <p className="text-sm text-gray-500">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                            <p>
                                This Privacy Policy describes how Vantix AI ("we", "our", or "us") collects, uses, and shares information when you use our application and services ("Service"). By using our Service, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                            <p>We may collect the following types of information:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Account Information:</strong> When you create an account, we collect your email address and authentication credentials through our authentication provider (Clerk).</li>
                                <li><strong>Brokerage Connection Data:</strong> If you connect a brokerage account (e.g., Alpaca), we store encrypted access tokens to facilitate trading on your behalf. We do NOT store your brokerage username or password.</li>
                                <li><strong>Usage Data:</strong> We may collect information about how you interact with our Service, including pages visited, features used, and timestamps.</li>
                                <li><strong>Device Information:</strong> We may collect information about your device, browser type, and IP address for security and analytics purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Provide, maintain, and improve our Service.</li>
                                <li>Execute trades on your connected brokerage account when you authorize them.</li>
                                <li>Communicate with you about updates, security alerts, and support.</li>
                                <li>Monitor and analyze usage patterns to improve user experience.</li>
                                <li>Detect, prevent, and address technical issues and security threats.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Third Parties</h2>
                            <p>We may share your information with:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Authentication Providers (Clerk):</strong> To manage user authentication and sessions.</li>
                                <li><strong>Brokerage Services (Alpaca):</strong> To execute trades and retrieve account information when you authorize it.</li>
                                <li><strong>Database Providers (Supabase):</strong> To securely store your data.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights, privacy, safety, or property.</li>
                            </ul>
                            <p className="mt-2">We do NOT sell your personal information to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. Sensitive information such as brokerage tokens is encrypted at rest. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
                            <p>
                                We retain your personal information only for as long as necessary to provide our Service and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your data within a reasonable timeframe, unless retention is required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
                            <p>Depending on your location, you may have the right to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Access the personal information we hold about you.</li>
                                <li>Request correction of inaccurate data.</li>
                                <li>Request deletion of your data.</li>
                                <li>Withdraw consent for data processing.</li>
                                <li>Disconnect your brokerage account at any time.</li>
                            </ul>
                            <p className="mt-2">To exercise these rights, please contact the administrator.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies and Local Storage</h2>
                            <p>
                                We may use cookies and local storage to remember your preferences, maintain sessions, and improve your experience. You can control cookie settings through your browser.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of the Service after changes constitutes acceptance of the revised policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact the administrator.
                            </p>
                        </section>

                        {/* Accept/Decline Buttons */}
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-4">
                                By clicking "I Accept", you acknowledge that you have read and understood this Privacy Policy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    I Accept
                                </button>
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
