import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const useCompanyStore = create((set, get) => ({
    problems: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    stats: {
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0
    },

    solvedProblems: new Set(),
    userStats: {
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0
    },

    filters: {
        company: '',
        difficulty: '',
        topics: '',
        search: ''
    },

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
        page: 1
    })),

    setPage: (page) => set({ page }),

    setLimit: (limit) => set({ limit, page: 1 }),

    clearFilters: () => set({
        filters: {
            company: '',
            difficulty: '',
            topics: '',
            search: ''
        },
        page: 1
    }),

    toggleSolved: async (problemId) => {
        const { solvedProblems, problems } = get();
        const isSolved = solvedProblems.has(problemId);

        try {
            if (isSolved) {
                await axios.delete(`/api/solved/${problemId}`);
                const newSolved = new Set(solvedProblems);
                newSolved.delete(problemId);
                set({ solvedProblems: newSolved });
            } else {
                await axios.post(`/api/solved/${problemId}`);
                const newSolved = new Set(solvedProblems);
                newSolved.add(problemId);
                set({ solvedProblems: newSolved });
            }

            get().updateUserStats();
            toast.success(isSolved ? 'Problem marked as unsolved' : 'Problem marked as solved');
        } catch (error) {
            console.error('Failed to toggle solved status:', error);
            toast.error('Failed to update status');
            throw error;
        }
    },

    updateUserStats: () => {
        const { solvedProblems, problems } = get();

        const userStats = {
            total: 0,
            easy: 0,
            medium: 0,
            hard: 0
        };

        problems.forEach(problem => {
            if (solvedProblems.has(problem.id)) {
                userStats.total++;
                if (problem.difficulty === 'EASY') userStats.easy++;
                else if (problem.difficulty === 'MEDIUM') userStats.medium++;
                else if (problem.difficulty === 'HARD') userStats.hard++;
            }
        });

        set({ userStats });
    },



    fetchProblems: async () => {
        set({ loading: true, error: null });

        try {
            const { page, limit, filters } = get();
            const params = {
                page,
                limit,
                ...filters
            };

            Object.keys(params).forEach(key => {
                if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
                    delete params[key];
                }
            });

            const response = await axios.get('/api/problems/companies/list', { params });

            const solved = new Set();
            response.data.data.forEach(problem => {
                if (problem.isSolved) {
                    solved.add(problem.id);
                }
            });

            set({
                problems: response.data.data,
                total: response.data.meta.total,
                totalPages: response.data.meta.totalPages,
                stats: response.data.meta.stats,
                solvedProblems: solved,
                loading: false
            });
            get().updateUserStats();
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch problems',
                loading: false
            });
            toast.error(error.response?.data?.message || 'Failed to fetch problems');
        }
    }
}));

export default useCompanyStore;
