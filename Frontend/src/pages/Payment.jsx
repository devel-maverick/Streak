import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, X, Loader2, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { PointerHighlight } from '@/components/ui/pointer-highlight';

export default function Payment() {
    const { user, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubscribe = async () => {
        if (!user) {
            navigate('/signin');
            return;
        }
        if (user.subscriptionPlan === 'PRO') return;

        setLoading(true);
        try {
            const { data: { subscriptionId } } = await axiosInstance.post('/payment/create-subscription');

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                subscription_id: subscriptionId,
                name: "Streak Pro",
                description: "Upgrade to Pro for AI Features",
                handler: async function (response) {
                    try {
                        const verifyRes = await axiosInstance.post('/payment/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment successful! Upgrading your account...");

                            setTimeout(() => {
                                checkAuth();
                                setLoading(false);
                                navigate('/profile');
                            }, 2000);
                        } else {
                            toast.error("Payment verification failed");
                            setLoading(false);
                        }

                    } catch (error) {
                        console.error("Verification failed", error);
                        toast.error("Payment verification failed");
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#4F46E5"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response) {
                toast.error("Payment Failed: " + response.error.description);
                setLoading(false);
            });

        } catch (error) {
            console.error("Subscription functionality failed", error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const isPro = user?.subscriptionPlan === 'PRO';

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                    Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">Pro</span>
                </h1>
                <p className="text-xl text-gray-500">
                    Supercharge your coding journey with AI-powered insights.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
                {/* FREE PLAN */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col relative overflow-hidden transition-transform hover:scale-[1.02]">
                    <div className="mb-4">
                        <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold tracking-wide uppercase">
                            Free Plan
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic</h2>
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-extrabold text-gray-900">₹0</span>
                        <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <p className="text-gray-500 mb-8">Perfect for getting started with coding challenges.</p>

                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "Access to all Practice Problems",
                            "Track Solved Problems",
                            "Community Discussion",
                            "Basic Progress Stats",
                            "Contest Calendar"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-600">
                                <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                {feature}
                            </li>
                        ))}
                        {[
                            "AI Code Analysis",
                            "Instant Code Explanation",
                            "Performance Optimization",
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-400">
                                <X className="w-5 h-5 text-gray-300 mr-3 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        className="w-full py-3 px-4 bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-default"
                        disabled
                    >
                        Current Plan
                    </button>
                </div>

                {/* PRO PLAN */}
                <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:scale-[1.02] border border-gray-800">
                    <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                    </div>
                    <div className="mb-4">
                        <span className="inline-block py-1 px-3 rounded-full bg-gray-800 text-gray-300 text-xs font-semibold tracking-wide uppercase border border-gray-700">
                            Pro Plan
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        <PointerHighlight>Pro</PointerHighlight>
                    </h2>
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-extrabold text-white">₹100</span>
                        <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    <p className="text-gray-400 mb-8">Unlock the full power of AI to learn faster.</p>

                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "Everything in Basic",
                            "AI Code Analysis (Time & Space)",
                            "Instant Code Explanation",
                            "Performance Optimization Tips",
                            "Priority Support",
                            "Early Access to New Features"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-300">
                                <div className="p-1 rounded-full bg-gray-800 mr-3">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleSubscribe}
                        disabled={loading || isPro}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2
                            ${isPro
                                ? "bg-green-600 text-white cursor-default hover:bg-green-600"
                                : "bg-gradient-to-r from-gray-200 to-white text-black hover:from-white hover:to-gray-100"
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : isPro ? (
                            <>
                                <Check size={20} /> Active Plan
                            </>
                        ) : (
                            "Upgrade Now"
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-4">
                        Secure payment via Razorpay. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}