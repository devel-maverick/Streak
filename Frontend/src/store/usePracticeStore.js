import { create } from 'zustand';
import axios from 'axios';
import useCompanyStore from './useCompanyStore';

const usePracticeStore = create((set, get) => ({
    problems: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    stats: {
        total: 0,
        codeforces: 0,
        cses: 0,
        leetcode: 0
    },
    userSolvedCounts: {
        total: 0,
        codeforces: 0,
        cses: 0
    },
    search: '',
    platformFilter: 'ALL',
    ratingFilter: null,
    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setPlatformFilter: (platform) => set({ platformFilter: platform, page: 1 }),
    setRatingFilter: (range) => set({ ratingFilter: range, page: 1 }),

    fetchProblems: async () => {
        set({ loading: true, error: null });

        try {
            const { page, limit, search, platformFilter, ratingFilter } = get();
            const params = {
                page,
                limit,
                search,
                platform: platformFilter === 'ALL' ? 'CODEFORCES,CSES' : platformFilter
            };

            if (ratingFilter) {
                params.minRating = ratingFilter.min;
                params.maxRating = ratingFilter.max;
            }

            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get('/api/problems/practice', { params, headers });
            const data = response.data;

            set({
                problems: data.problems,
                totalPages: data.totalPages,
                stats: data.stats,
                userSolvedCounts: data.userSolvedCounts || { total: 0, codeforces: 0, cses: 0 },
                loading: false,
                error: null
            });

        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("Auth failed, retrying without token...");
                const { page, limit, search, platformFilter, ratingFilter } = get();
                const params = {
                    page,
                    limit,
                    search,
                    platform: platformFilter === 'ALL' ? 'CODEFORCES,CSES' : platformFilter
                };

                if (ratingFilter) {
                    params.minRating = ratingFilter.min;
                    params.maxRating = ratingFilter.max;
                }
                try {
                    const retryResponse = await axios.get('/api/problems/practice', { params });
                    const retryData = retryResponse.data;

                    set({
                        problems: retryData.problems || [],
                        totalPages: retryData.totalPages || 0,
                        stats: retryData.stats,
                        userSolvedCounts: { total: 0, codeforces: 0, cses: 0 },
                        loading: false,
                        error: null
                    });
                    return;
                } catch (retryError) {
                    console.error("Retry failed:", retryError);
                }
            }

            set({
                error: error.response?.data?.message || 'Failed to fetch practice problems',
                loading: false
            });
        }
    },
    toggleSolved: async (problemId) => {
        const { problems, userSolvedCounts } = get();

        try {
            const problem = problems.find(p => p.id === problemId);
            if (!problem) return;

            const isSolved = problem.isSolved;

            const updatedProblems = problems.map(p =>
                p.id === problemId ? { ...p, isSolved: !isSolved } : p
            );
            const newCounts = { ...userSolvedCounts };
            if (!isSolved) {
                newCounts.total++;
                if (problem.platform === 'CODEFORCES') newCounts.codeforces++;
                else if (problem.platform === 'CSES') newCounts.cses++;
            } else {
                newCounts.total--;
                if (problem.platform === 'CODEFORCES') newCounts.codeforces--;
                else if (problem.platform === 'CSES') newCounts.cses--;
            }

            set({ problems: updatedProblems, userSolvedCounts: newCounts });

            if (isSolved) {
                await axios.delete(`/api/solved/${problemId}`);
            } else {
                await axios.post(`/api/solved/${problemId}`);
            }

        } catch (error) {
            console.error('Failed to toggle solved status:', error);

            const { problems, userSolvedCounts } = get();
            const problem = problems.find(p => p.id === problemId);

            if (problem) {
                const revertedIsSolved = !problem.isSolved;

                const revertedProblems = problems.map(p =>
                    p.id === problemId ? { ...p, isSolved: revertedIsSolved } : p
                );

                const revertedCounts = { ...userSolvedCounts };
                if (revertedIsSolved) {
                    revertedCounts.total++;
                    if (problem.platform === 'CODEFORCES') revertedCounts.codeforces++;
                    else if (problem.platform === 'CSES') revertedCounts.cses++;
                } else {
                    revertedCounts.total--;
                    if (problem.platform === 'CODEFORCES') revertedCounts.codeforces--;
                    else if (problem.platform === 'CSES') revertedCounts.cses--;
                }

                set({ problems: revertedProblems, userSolvedCounts: revertedCounts });
            }
        }
    },
}));

export default usePracticeStore;
