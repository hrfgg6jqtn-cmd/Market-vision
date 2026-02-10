'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TermsOfUse() {
    const router = useRouter();

    const handleAccept = () => {
        // Store acceptance in localStorage
        localStorage.setItem('termsAccepted', 'true');
        localStorage.setItem('termsAcceptedDate', new Date().toISOString());
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8 border-b pb-4">
                        Terms of Use
                    </h1>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <p className="text-sm text-gray-500">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using this application ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
                            <h2 className="text-xl font-bold text-red-800 mb-3">2. No Financial Advice & Risk Disclosure</h2>
                            <p className="text-red-900 font-medium">
                                The content provided by this Service, including data, charts, indicators, and AI-generated analysis, is for informational and educational purposes only.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-red-800">
                                <li>We do NOT provide financial, investment, legal, or tax advice.</li>
                                <li>You acknowledge that trading in financial markets (stocks, crypto, forex, etc.) involves a high degree of risk and can result in the loss of your entire investment.</li>
                                <li>You are solely responsible for your own investment decisions. Do not trade with money you cannot afford to lose.</li>
                                <li>Past performance of any trading system or methodology is not necessarily indicative of future results.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Limitation of Liability</h2>
                            <p>
                                To the fullest extent permitted by applicable law, in no event will the developers, owners, or affiliates of this Service be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the Service, even if we have been advised of the possibility of such damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Accuracy of Information</h2>
                            <p>
                                While we strive to provide accurate and up-to-date information, we do not warrant that the information available on this Service is accurate, complete, reliable, current, or error-free. Market data may be delayed or inaccurate. We assume no liability or responsibility for any errors or omissions in the content of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Services</h2>
                            <p>
                                This Service may integrate with third-party brokerage services (such as Alpaca) or data providers.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Your use of third-party services is governed by their respective Terms of Service and Privacy Policies.</li>
                                <li>We do not control and are not responsible for the actions, omissions, or availability of any third-party service.</li>
                                <li>Execution of trades is strictly between you and your brokerage. We are not a broker-dealer.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Conduct</h2>
                            <p>
                                You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You agree not to attempt to gain unauthorized access to any portion of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Modifications to Terms</h2>
                            <p>
                                We reserve the right to change these conditions from time to time as we see fit and your continued use of the site will signify your acceptance of any adjustment to these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact</h2>
                            <p>
                                If you have any questions about these Terms, please contact the administrator.
                            </p>
                        </section>

                        {/* Accept/Decline Buttons */}
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-4">
                                By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
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
