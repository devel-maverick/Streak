import { Search, X } from 'lucide-react';
import useCompanyStore from '../../store/useCompanyStore';
export default function FilterBar() {

    const { filters, setFilters, clearFilters } = useCompanyStore();

    const handleSearchChange = (e) => {
        setFilters({ search: e.target.value });
    };

    const handleDifficultyChange = (e) => {
        setFilters({ difficulty: e.target.value });
    };

    const handleTopicsChange = (e) => {
        setFilters({ topics: e.target.value });
    };

    const hasActiveFilters = filters.search || filters.difficulty || filters.company || filters.topics;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Difficulty */}
                <select
                    value={filters.difficulty}
                    onChange={handleDifficultyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                    <option value="">Difficulty</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>

                {/* Topics */}
                <input
                    type="text"
                    placeholder="Topics"
                    value={filters.topics}
                    onChange={handleTopicsChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear all filters
                </button>
            )}
        </div>
    );
}
