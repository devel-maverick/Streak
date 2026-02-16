import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function TimelineSection() {
    const data = [
        {
            title: "Practice",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Master Data Structures and Algorithms with curatable problem sets.
                        Filter by topic, difficulty, or platform to focus your preparation.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4">
                            <h4 className="font-bold text-sm mb-2 text-black dark:text-white">Multi-Platform</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">LeetCode, Codeforces, & more</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4">
                            <h4 className="font-bold text-sm mb-2 text-black dark:text-white">Topic Tags</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Filter by specific topics</p>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 mb-8 w-full">
                        <img
                            src="/assets/timeline_practice_new.png"
                            alt="Practice Page Feature"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Compete",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Never miss a contest again. Visualize upcoming competitions from all major platforms
                        in a unified calendar view.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4">
                            <h4 className="font-bold text-sm mb-2 text-black dark:text-white">Live Updates</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Real-time contest schedules</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-4">
                            <h4 className="font-bold text-sm mb-2 text-black dark:text-white">Color Coded</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Contest Platforms</p>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 mb-8 w-full">
                        <img
                            src="/assets/timeline_compete_new.png"
                            alt="Contest Calendar Feature"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Analyze",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                        Visualize your growth with comprehensive analytics. Track your streak,
                        accepted solutions, and difficulty breakdown over time.
                    </p>
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 mb-8 w-full">
                        <img
                            src="/assets/timeline_analyze_new.png"
                            alt="Analytics Dashboard Feature"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="w-full bg-white dark:bg-neutral-950">
            <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white mb-6 tracking-tight">
                        Your Ultimate Coding Companion
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium">
                        Everything you need to master algorithms, compete in contests, and track your progress in one place.
                    </p>
                </div>
                <Timeline data={data} />
            </div>
        </div>
    );
}
