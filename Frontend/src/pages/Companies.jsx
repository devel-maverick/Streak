import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import useCompanyStore from '../store/useCompanyStore';
import StatsHeader from '../components/companies/StatsHeader';
import FilterBar from '../components/companies/FilterBar';
import QuestionCard from '../components/companies/QuestionCard';
import Pagination from '../components/companies/Pagination';

export default function Companies() {
    const { problems, loading, error, stats, page, limit, filters, fetchProblems } = useCompanyStore();

    useEffect(() => {
        fetchProblems();
    }, [page, limit, filters]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <StatsHeader stats={stats} />
                <FilterBar />
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                                <div className="col-span-5">Title</div>
                                <div className="col-span-2 text-center">Difficulty</div>
                                <div className="col-span-1 text-center">Acceptance</div>
                                <div className="col-span-2 text-center">Frequency</div>
                                <div className="col-span-2 text-center">Progress</div>
                            </div>

                            {problems.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No problems found. Try adjusting your filters.
                                </div>
                            ) : (
                                problems.map((problem) => (
                                    <QuestionCard key={problem.id} problem={problem} />
                                ))
                            )}
                        </div>

                        {problems.length > 0 && <Pagination />}
                    </>
                )}
            </div>
        </div>
    );
}