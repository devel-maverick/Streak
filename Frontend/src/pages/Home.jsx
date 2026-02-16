import { motion } from "framer-motion";
import MarqueeBrandsDemo from "@/components/shadcn-space/marquee/marquee-02";
import Footer from "../components/Footer";
import TimelineSection from "../components/TimelineSection";
import FAQ from "../components/FAQ";
import BentoGrid from "../components/BentoGrid";
import { CompareDemo } from "@/components/CodeBlock";
import { useAuthStore } from "../store/useAuthStore";
import { useUIStore } from "../store/useUIStore";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
    const { user } = useAuthStore();
    const { openSignIn } = useUIStore();
    const navigate = useNavigate();

    const handleStartPractice = () => {
        if (user) {
            navigate('/companies');
        } else {
            openSignIn();
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
                <div className="flex flex-col border-b overflow-hidden">
                    <div className="flex border-b items-center py-12 lg:py-0 lg:h-[calc(100vh-66px)]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 lg:gap-0"
                        >
                            {/* LEFT PART */}
                            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-4">
                                    Build <br /> Consistency
                                </h1>
                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-4 text-gray-400">
                                    Solve <br /> Better
                                </h1>
                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-6">
                                    Win Together
                                </h1>

                                <p className="text-base sm:text-lg text-gray-600 max-w-md mb-8">
                                    Join the community of developers mastering algorithms.
                                    Track, compete, and grow every single day.
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleStartPractice}
                                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Start Practice
                                    </button>
                                    <Link
                                        to="/contest"
                                        className="px-8 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-colors block text-center"
                                    >
                                        View Contests
                                    </Link>
                                </div>
                            </div>
                            {/* RIGHT PART */}
                            <div className="w-full lg:w-1/2 flex items-center justify-center">
                                <CompareDemo />
                            </div>
                        </motion.div>
                    </div>

                    <div className="border-t bg-gray-50 py-3">
                        <MarqueeBrandsDemo />
                        <p className="text-center text-xs font-medium text-gray-400 py-3 uppercase tracking-widest">
                            Trusted by developers from top companies
                        </p>
                    </div>
                </div>
                <section className="bg-gray-50">
                    <BentoGrid />
                </section>

                <TimelineSection />

                <FAQ />
            </div>
            <Footer />
        </div>
    );
}