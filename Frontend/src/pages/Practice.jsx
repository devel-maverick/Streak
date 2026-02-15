import React, { useEffect } from 'react';
import usePracticeStore from '../store/usePracticeStore';
import QuestionCard from '../components/companies/QuestionCard';
import { Search, ChevronLeft, ChevronRight, Award, Code2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Practice() {
    const {
        problems,
        loading,
        error,
        page,
        totalPages,
        fetchProblems,
        setPage,
        stats,
        userSolvedCounts,
        search,
        setSearch,
        platformFilter,
        setPlatformFilter,
        ratingFilter,
        setRatingFilter
    } = usePracticeStore();

    useEffect(() => {
        fetchProblems();
    }, [page, search, platformFilter, ratingFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProblems();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {/* Stats Header*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Problems</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {userSolvedCounts.total} <span className="text-gray-400 text-lg">/ {stats.total}</span>
                                </h3>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <Award className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.total ? (userSolvedCounts.total / stats.total) * 100 : 0}%` }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Codeforces</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {userSolvedCounts.codeforces} <span className="text-gray-400 text-lg">/ {stats.codeforces}</span>
                                </h3>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Code2 className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.codeforces ? (userSolvedCounts.codeforces / stats.codeforces) * 100 : 0}%` }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">CSES</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {userSolvedCounts.cses} <span className="text-gray-400 text-lg">/ {stats.cses}</span>
                                </h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Terminal className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.cses ? (userSolvedCounts.cses / stats.cses) * 100 : 0}%` }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Filters & Search */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Platform Filter */}
                        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
                            {['ALL', 'CODEFORCES', 'CSES'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPlatformFilter(p)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${platformFilter === p
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Rating Filter */}
                        <div className="flex items-center gap-2">
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'ALL') setRatingFilter(null);
                                    else {
                                        const [min, max] = val.split('-').map(Number);
                                        setRatingFilter({ min, max });
                                    }
                                }}
                            >
                                <option value="ALL">All Ratings</option>
                                <option value="800-1000">800 - 1000 (Easy)</option>
                                <option value="1000-1400">1000 - 1400 (Medium)</option>
                                <option value="1400-1900">1400 - 1900 (Hard)</option>
                                <option value="1900-3500">1900+ (Expert)</option>
                            </select>
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                {/* Problems List */}
                {!loading && !error && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-12 md:col-span-5">Title</div>
                            <div className="hidden md:block col-span-2 text-center">Rating (CF)</div>
                            <div className="hidden md:block col-span-3 text-center">Topics</div>
                            <div className="hidden md:block col-span-2 text-center">Progress</div>
                        </div>

                        {/* Problems */}
                        <div className="divide-y divide-gray-200">
                            {problems.map((problem) => (
                                <QuestionCard
                                    key={problem.id}
                                    problem={problem}
                                    showMetadata={true}
                                    context="practice"
                                />
                            ))}

                            {problems.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    No problems found matching your criteria.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                                            disabled={page === totalPages || totalPages === 0}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading problems...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-12 text-red-600">
                        <p>{error}</p>
                        <button
                            onClick={() => fetchProblems()}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
