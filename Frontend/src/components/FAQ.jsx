import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "How does Streak track my progress?",
        answer: "Streak syncs with your coding profiles (LeetCode, Codeforces, etc.) to automatically track your solved problems and maintain your daily consistency."
    },
    {
        question: "Is Streak free to use?",
        answer: "Yes! Streak offers a free tier that includes basic tracking, contest calendars, and practice problems. We also have a premium subscription for advanced analytics."
    },
    {
        question: "Can I filter problems by company?",
        answer: "Absolutely. Our 'Companies' section allows you to filter problems by specific tech giants like Google, Amazon, and Microsoft to help you prepare for interviews."
    },
    {
        question: "How often is the data updated?",
        answer: "Data is synced in real-time or periodically depending on the platform API limits. You can also manually trigger a sync from your profile page."
    },
    {
        question: "Do you support custom problem lists?",
        answer: "Yes, you can create custom playlists of problems or follow curated lists created by top competitive programmers."
    }
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 last:border-none">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                onClick={onClick}
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-black' : 'text-gray-600 group-hover:text-black'}`}>
                    {question}
                </span>
                <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-500 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-24 bg-gray-50" id="faq">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 sm:px-10 py-2">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={index === openIndex}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
