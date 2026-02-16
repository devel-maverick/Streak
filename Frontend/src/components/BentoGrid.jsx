import React from "react";
import { Link } from "react-router-dom";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
    IconCode,
    IconBrain,
    IconFlame,
    IconTerminal2,
    IconCalendar,
    IconBuildingSkyscraper,
    IconArrowRight,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function BentoGridDemo() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold mb-2">Everything you need</h2>
            <p className="text-gray-500 text-lg mb-12">One platform for all your coding practice needs.</p>
            <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[24rem] md:grid-cols-4">
                {items.map((item, i) => (
                    <Link to={item.path} key={i} className={item.className}>
                        <BentoGridItem
                            header={item.header}
                            className="h-full p-0"
                        />
                    </Link>
                ))}
            </BentoGrid>
        </div>
    );
}

const PracticeHeader = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative group">
        <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="coding"
            className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-100 to-transparent" />
        <div className="flex flex-col justify-end h-full relative z-10 p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1"><IconCode size={16} /> Practice</h3>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">800+ Problems</h2>
            <p className="text-sm text-neutral-600 mb-4">From LeetCode, Codeforces, CodeChef & CSES. Solve inside STREAK or on original platforms.</p>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium w-fit flex items-center gap-2 group-hover:bg-neutral-800 transition-colors">Start Practicing <IconArrowRight size={16} /></button>
        </div>
    </div>
);

const AnalysisHeader = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/[0.2] overflow-hidden relative group">
        <img
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="ai analysis"
            className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
        <div className="flex flex-col justify-end h-full relative z-10 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1"><IconBrain size={16} /> AI Powered</h3>
            <h2 className="text-2xl font-bold text-white mb-2">Smart Analysis</h2>
            <p className="text-xs text-gray-300 mb-4 line-clamp-3">Time & space complexity, optimization hints, error explanation, and personalized improvement tips.</p>
            <span className="text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline text-white">Try in Playground <IconArrowRight size={14} /></span>
        </div>
    </div>
);

const StreakHeader = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/[0.2] overflow-hidden relative group">
        <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="streak abstract"
            className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
        <div className="flex flex-col justify-end h-full relative z-10 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1"><IconFlame size={16} /> Consistency</h3>
            <h2 className="text-2xl font-bold text-white mb-2">Build Your Streak</h2>
            <p className="text-xs text-gray-300 mb-4">Daily discipline. GitHub-style heatmap. Never break the chain.</p>
            <span className="text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline text-white">View Stats <IconArrowRight size={14} /></span>
        </div>
    </div>
);


const PlaygroundHeader = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-white border border-neutral-200 overflow-hidden relative group">
        <img
            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="coding playground"
            className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        <div className="flex flex-col justify-end h-full relative z-10 p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1"><IconTerminal2 size={16} /> Playground</h3>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Multi-Language Editor</h2>
            <p className="text-xs text-neutral-600 mb-4">C++, Python, Java, JavaScript. Run, analyze, and optimize code instantly.</p>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium w-fit flex items-center gap-2 hover:bg-gray-200 transition-colors border border-black/10">Open Playground</button>
        </div>
    </div>
);

const ContestHeader = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-transparent dark:border-white/[0.2] overflow-hidden relative group">
        <img
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="calendar"
            className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-100 to-transparent dark:from-neutral-900" />
        <div className="flex flex-col justify-end h-full relative z-10 p-4">
            <h3 className="text-sm font-semibold text-neutral-800 mb-1 flex items-center gap-1"><IconCalendar size={16} /> Contests</h3>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Never Miss One</h2>
            <p className="text-xs text-neutral-600 mb-4">Track upcoming contests from all major platforms in one place.</p>
            <span className="text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline text-neutral-800">View Calendar <IconArrowRight size={14} /></span>
        </div>
    </div>
);

const CompanyHeader = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/[0.2] overflow-hidden relative group">
        <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="skyscraper"
            className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
        <div className="flex flex-col justify-end h-full relative z-10 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1"><IconBuildingSkyscraper size={16} /> Interview Prep</h3>
            <h2 className="text-2xl font-bold text-white mb-2">Company-Wise</h2>
            <p className="text-xs text-gray-300 mb-4">Targeted preparation for top tech companies. Curated lists.</p>
            <span className="text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline text-white">Explore Companies <IconArrowRight size={14} /></span>
        </div>
    </div>
);


const items = [
    {
        header: <PracticeHeader />,
        className: "md:col-span-2",
        path: "/practice",
    },
    {
        header: <AnalysisHeader />,
        className: "md:col-span-1",
        path: "/analysis",
    },
    {
        header: <StreakHeader />,
        className: "md:col-span-1",
        path: "/streak",
    },
    {
        header: <PlaygroundHeader />,
        className: "md:col-span-2",
        path: "/playground",
    },
    {
        header: <ContestHeader />,
        className: "md:col-span-1",
        path: "/contests",
    },
    {
        header: <CompanyHeader />,
        className: "md:col-span-1",
        path: "/companies",
    },
];
