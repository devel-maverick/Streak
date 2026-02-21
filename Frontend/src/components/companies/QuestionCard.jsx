import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import useCompanyStore from '../../store/useCompanyStore';
import usePracticeStore from '../../store/usePracticeStore';
import { useState } from 'react';

export default function QuestionCard({ problem, showMetadata = true, context = 'company' }) {
    const companyStore = useCompanyStore();
    const practiceStore = usePracticeStore();

    const solvedProblems = context === 'practice' ? null : companyStore.solvedProblems;

    const isSolved = context === 'practice'
        ? problem.isSolved
        : (showMetadata ? solvedProblems.has(problem.id) : (problem.isSolved !== undefined ? problem.isSolved : solvedProblems.has(problem.id)));

    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async () => {
        setIsToggling(true);
        try {
            if (context === 'practice') {
                await practiceStore.toggleSolved(problem.id);
            } else {
                await companyStore.toggleSolved(problem.id);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Please sign in to mark problems as solved");
            }
            console.error('Failed to toggle:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return 'text-green-600';
            case 'MEDIUM':
                return 'text-orange-600';
            case 'HARD':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatDifficulty = (difficulty) => {
        return difficulty ? difficulty.charAt(0) + difficulty.slice(1).toLowerCase() : '-';
    };

    const getLeetCodeUrl = () => {
        if (problem.url) {
            if (problem.url.startsWith('http://') || problem.url.startsWith('https://')) {
                return problem.url;
            }
            if (problem.url.startsWith('/')) {
                return `https://leetcode.com${problem.url}`;
            }
            return `https://leetcode.com/${problem.url}`;
        }

        const slug = problem.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        return `https://leetcode.com/problems/${slug}/`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
            <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center">
                <div className={`${showMetadata ? 'col-span-5' : 'col-span-12'} flex items-center gap-3`}>
                    <input
                        type="checkbox"
                        checked={!!isSolved}
                        disabled={isToggling}
                        onChange={handleToggle}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer disabled:opacity-50"
                    />

                    <div className="flex-1 min-w-0">
                        {/* Title with Link */}
                        <a
                            href={getLeetCodeUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium text-gray-900 hover:text-blue-600 inline-flex items-center gap-2 group mb-2"
                        >
                            {problem.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </a>

                        {showMetadata && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {problem.company ? (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                        {problem.company}
                                    </span>
                                ) : problem.platform && (
                                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${problem.platform === 'CODEFORCES' ? 'bg-red-100 text-red-700' :
                                        problem.platform === 'CSES' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {problem.platform}
                                    </span>
                                )}

                                {problem.topics && problem.topics.length > 0 && (
                                    <>
                                        {problem.topics.slice(0, 3).map((topic, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                        {problem.topics.length > 3 && (
                                            <div className="relative group">
                                                <span className="px-2 py-0.5 text-gray-500 text-xs cursor-help hover:text-gray-700 border-b border-dotted border-gray-400">
                                                    +{problem.topics.length - 3} more
                                                </span>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                                        {problem.topics.slice(3).map((topic, idx) => (
                                                            <span key={idx} className="bg-gray-700 px-1.5 py-0.5 rounded">
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {!showMetadata && problem.platform && (
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded font-medium ${problem.platform === 'CODEFORCES' ? 'bg-red-100 text-red-700' :
                                problem.platform === 'CSES' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {problem.platform}
                            </span>
                        )}
                    </div>
                </div>

                {showMetadata && (
                    <>
                        <div className="col-span-2 text-center">
                            {context === 'practice' ? (
                                problem.platform === 'CODEFORCES' ? (
                                    <span className={`font-medium ${!problem.rating ? 'text-gray-500' :
                                        problem.rating < 1200 ? 'text-green-600' :
                                            problem.rating < 1600 ? 'text-yellow-600' :
                                                'text-red-600'
                                        }`}>
                                        {problem.rating || '-'}
                                    </span>
                                ) : (
                                    <span className={`font-medium ${!problem.rating ? 'text-gray-500' :
                                        problem.rating < 1200 ? 'text-green-600' :
                                            problem.rating < 1600 ? 'text-yellow-600' :
                                                'text-red-600'
                                        }`}>
                                        {problem.rating || '-'}
                                    </span>
                                )
                            ) : (
                                <div className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                    {formatDifficulty(problem.difficulty)}
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block col-span-1 text-center">
                            {problem.acceptance ? (
                                <div className="text-sm font-medium text-gray-700">
                                    {problem.acceptance.toFixed(1)}%
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400">-</div>
                            )}
                        </div>

                        <div className="hidden md:block col-span-2 text-center">
                            {problem.frequency ? (
                                <div className="text-sm font-medium text-gray-700">
                                    {problem.frequency.toFixed(1)}%
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400">-</div>
                            )}
                        </div>

                        <div className="hidden md:block col-span-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${problem.difficulty === 'EASY' ? 'bg-green-600' :
                                        problem.difficulty === 'MEDIUM' ? 'bg-orange-600' :
                                            'bg-red-600'
                                        }`}
                                    style={{ width: isSolved ? '100%' : '0%' }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
