import axios from 'axios';
import prisma from "../config/db.js";

export const fetchLeetCodeStats = async (username) => {
    try {
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                    profile {
                        ranking
                    }
                    submissionCalendar
                }
                userContestRanking(username: $username) {
                    rating
                    globalRanking
                }
            }
        `;

        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        });

        if (response.data.errors) {
            throw new Error('User not found');
        }

        const data = response.data.data.matchedUser;
        const contestRanking = response.data.data.userContestRanking;
        const stats = data.submitStats.acSubmissionNum;

        let submissionCalendar = {};
        try {
            submissionCalendar = JSON.parse(data.submissionCalendar || '{}');
        } catch (e) {
            console.error('Failed to parse submission calendar:', e);
        }

        return {
            username,
            totalSolved: stats.find(s => s.difficulty === 'All')?.count || 0,
            easySolved: stats.find(s => s.difficulty === 'Easy')?.count || 0,
            mediumSolved: stats.find(s => s.difficulty === 'Medium')?.count || 0,
            hardSolved: stats.find(s => s.difficulty === 'Hard')?.count || 0,
            ranking: data.profile.ranking || 0,
            rating: contestRanking ? Math.round(contestRanking.rating) : 0,
            submissionCalendar: submissionCalendar
        };
    } catch (error) {
        console.error(`LeetCode fetch error for ${username}:`, error.message);
        return null;
    }
};

export const fetchCodeforcesStats = async (username) => {
    try {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);

        if (response.data.status !== 'OK') {
            throw new Error('User not found');
        }

        const user = response.data.result[0];

        const submissionsRes = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`);

        let solvedProblems = new Set();
        let submissionCalendar = {};

        if (submissionsRes.data.status === 'OK') {
            submissionsRes.data.result.forEach(submission => {
                if (submission.verdict === 'OK') {
                    solvedProblems.add(`${submission.problem.contestId}-${submission.problem.index}`);

                    const date = new Date(submission.creationTimeSeconds * 1000);
                    date.setUTCHours(0, 0, 0, 0);
                    const timestamp = Math.floor(date.getTime() / 1000).toString();

                    submissionCalendar[timestamp] = (submissionCalendar[timestamp] || 0) + 1;
                }
            });
        }

        return {
            username,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || 'unrated',
            totalSolved: solvedProblems.size,
            submissionCalendar: submissionCalendar
        };
    } catch (error) {
        console.error(`Codeforces fetch error for ${username}:`, error.message);
        return null;
    }
};

export const fetchCodeChefStats = async (username) => {
    try {
        console.log(`CodeChef stats not yet implemented for ${username}`);
        return null;
    } catch (error) {
        console.error(`CodeChef fetch error for ${username}:`, error.message);
        return null;
    }
};

export const syncAllUserStats = async () => {
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { leetcodeUsername: { not: null } },
                    { codeforcesUsername: { not: null } },
                    { codechefUsername: { not: null } }
                ]
            },
            select: {
                id: true,
                leetcodeUsername: true,
                codeforcesUsername: true,
                codechefUsername: true
            }
        });

        console.log(`Syncing stats for ${users.length} users`);
        let successCount = 0;

        for (const user of users) {
            try {
                const updates = {
                    solvedLeetcode: 0,
                    solvedCodeforces: 0,
                    solvedCodechef: 0,
                    totalSolved: 0,
                    leetcodeEasy: 0,
                    leetcodeMedium: 0,
                    leetcodeHard: 0,
                    leetcodeRanking: null,
                    leetcodeRating: 0,
                    codeforcesRating: 0,
                    codeforcesMaxRating: 0,
                    codeforcesRank: null,
                    codechefRating: 0,
                    lastSyncedAt: new Date()
                };

                if (user.leetcodeUsername) {
                    const lcStats = await fetchLeetCodeStats(user.leetcodeUsername);
                    if (lcStats) {
                        updates.solvedLeetcode = lcStats.totalSolved;
                        updates.leetcodeEasy = lcStats.easySolved;
                        updates.leetcodeMedium = lcStats.mediumSolved;
                        updates.leetcodeHard = lcStats.hardSolved;
                        updates.leetcodeRanking = lcStats.ranking;
                        updates.leetcodeRating = lcStats.rating;
                    }
                }

                if (user.codeforcesUsername) {
                    const cfStats = await fetchCodeforcesStats(user.codeforcesUsername);
                    if (cfStats) {
                        updates.solvedCodeforces = cfStats.totalSolved;
                        updates.codeforcesRating = cfStats.rating;
                        updates.codeforcesMaxRating = cfStats.maxRating;
                        updates.codeforcesRank = cfStats.rank;
                    }
                }

                if (user.codechefUsername) {
                    const ccStats = await fetchCodeChefStats(user.codechefUsername);
                    if (ccStats) {
                        updates.solvedCodechef = ccStats.totalSolved;
                    }
                }

                updates.totalSolved = updates.solvedLeetcode + updates.solvedCodeforces + updates.solvedCodechef;

                await prisma.user.update({
                    where: { id: user.id },
                    data: updates
                });

                successCount++;
                console.log(`✓ Updated stats for user ${user.id}`);
            } catch (err) {
                console.error(`✗ Failed to update user ${user.id}:`, err.message);
            }
        }

        return {
            success: true,
            totalUsers: users.length,
            successCount,
            failedCount: users.length - successCount
        };
    } catch (error) {
        console.error('Sync all users error:', error);
        throw error;
    }
};

export const syncUserStats = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                leetcodeUsername: true,
                codeforcesUsername: true,
                codechefUsername: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const updates = {
            solvedLeetcode: 0,
            solvedCodeforces: 0,
            solvedCodechef: 0,
            totalSolved: 0,
            leetcodeEasy: 0,
            leetcodeMedium: 0,
            leetcodeHard: 0,
            leetcodeRanking: null,
            leetcodeRating: 0,
            codeforcesRating: 0,
            codeforcesMaxRating: 0,
            codeforcesRank: null,
            lastSyncedAt: new Date()
        };

        if (user.leetcodeUsername) {
            const lcStats = await fetchLeetCodeStats(user.leetcodeUsername);
            if (lcStats) {
                updates.solvedLeetcode = lcStats.totalSolved;
                updates.leetcodeEasy = lcStats.easySolved;
                updates.leetcodeMedium = lcStats.mediumSolved;
                updates.leetcodeHard = lcStats.hardSolved;
                updates.leetcodeRanking = lcStats.ranking;
                updates.leetcodeRating = lcStats.rating;
            }
        }

        if (user.codeforcesUsername) {
            const cfStats = await fetchCodeforcesStats(user.codeforcesUsername);
            if (cfStats) {
                updates.solvedCodeforces = cfStats.totalSolved;
                updates.codeforcesRating = cfStats.rating;
                updates.codeforcesMaxRating = cfStats.maxRating;
                updates.codeforcesRank = cfStats.rank;
            }
        }

        if (user.codechefUsername) {
            const ccStats = await fetchCodeChefStats(user.codechefUsername);
            if (ccStats) updates.solvedCodechef = ccStats.totalSolved;
        }

        updates.totalSolved = updates.solvedLeetcode + updates.solvedCodeforces + updates.solvedCodechef;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates
        });

        return { success: true, updates, user: updatedUser };
    } catch (error) {
        console.error('Sync user stats error:', error);
        throw error;
    }
};

export const triggerUserSync = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await syncUserStats(userId);

        res.json({
            message: 'Stats synced successfully',
            stats: result.updates
        });
    } catch (error) {
        console.error('Trigger sync error:', error);
        res.status(500).json({ message: 'Failed to sync stats' });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                totalSolved: true,
                solvedLeetcode: true,
                solvedCodeforces: true,
                solvedCodechef: true,
                solvedAtcoder: true,
                leetcodeEasy: true,
                leetcodeMedium: true,
                leetcodeHard: true,
                leetcodeRanking: true,
                codeforcesRating: true,
                codeforcesMaxRating: true,
                codeforcesRank: true,
                currentStreak: true,
                maxStreak: true,
                activeDays: true,
                lastSyncedAt: true,
                leetcodeUsername: true,
                codeforcesUsername: true,
                codechefUsername: true,
                atcoderUsername: true
            }
        });

        res.json({ stats: user });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};

export const getSubmissionActivity = async (req, res) => {
    try {
        const { platform } = req.params;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                leetcodeUsername: true,
                codeforcesUsername: true,
                codechefUsername: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let calendar = {};

        if (platform === 'leetcode' && user.leetcodeUsername) {
            const stats = await fetchLeetCodeStats(user.leetcodeUsername);
            if (stats && stats.submissionCalendar) {
                calendar = stats.submissionCalendar;
            }
        } else if (platform === 'codeforces' && user.codeforcesUsername) {
            const stats = await fetchCodeforcesStats(user.codeforcesUsername);
            if (stats && stats.submissionCalendar) {
                calendar = stats.submissionCalendar;
            }
        } else if (platform === 'codechef' && user.codechefUsername) {
            calendar = {};
        } else {
            return res.status(400).json({
                message: `Platform ${platform} not connected or not supported`
            });
        }

        res.json({
            platform,
            calendar,
            username: user[`${platform}Username`]
        });
    } catch (error) {
        console.error('Get submission activity error:', error);
        res.status(500).json({ message: 'Failed to fetch submission activity' });
    }
};
