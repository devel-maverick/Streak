import { motion } from 'framer-motion';
import useCompanyStore from '../../store/useCompanyStore';

export default function StatsHeader({ stats }) {
    const { userStats } = useCompanyStore();

    const getPercentage = (solved, total) => {
        return total > 0 ? ((solved / total) * 100).toFixed(1) : 0;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Practice Questions</h2>
                    <p className="text-gray-600 mt-1">Browse through {stats.total} DSA questions asked in technical interviews</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total */}
                <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{userStats.total}</div>
                    <div className="text-sm text-gray-500 mt-1">/{stats.total}</div>
                    <div className="text-sm font-medium text-gray-700 mt-2">Total Solved</div>
                </div>

                {/* Easy */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">{userStats.easy}</span>
                        <span className="text-sm text-gray-500">/{stats.easy}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                            className="bg-green-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getPercentage(userStats.easy, stats.easy)}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Easy</div>
                </div>

                {/* Medium */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-orange-600">{userStats.medium}</span>
                        <span className="text-sm text-gray-500">/{stats.medium}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                            className="bg-orange-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getPercentage(userStats.medium, stats.medium)}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Medium</div>
                </div>

                {/* Hard */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-red-600">{userStats.hard}</span>
                        <span className="text-sm text-gray-500">/{stats.hard}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <motion.div
                            className="bg-red-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getPercentage(userStats.hard, stats.hard)}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Hard</div>
                </div>
            </div>
        </div>
    );
}
