import prisma from "../config/db.js"
import axios from 'axios'
export const markSolved = async (req, res) => {

    try {
        const id = req.user.id
        const { problemId } = req.params
        const problem = await prisma.problem.findUnique({
            where: {
                id: problemId
            }
        })
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        await prisma.SolvedProblem.upsert({
            where: {
                userId_problemId: {
                    userId: id,
                    problemId
                }
            },
            create: {
                userId: id,
                problemId: problem.id,
            }
            , update: {}
        })

        res.status(200).json({ message: "Problem marked as solved" })


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to mark problem as solved' })
    }
}

export const removeSolved = async (req, res) => {
    try {
        const id = req.user.id
        const { problemId } = req.params

        await prisma.solvedProblem.deleteMany({
            where: {
                userId: id,
                problem: {
                    id: problemId
                }
            }
        })

        res.status(200).json({ message: "Problem marked as unsolved" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to mark problem as unsolved' })
    }
}

export const getSolved = async (req, res) => {
    try {
        const id = req.user.id
        const solvedProblems = await prisma.SolvedProblem.findMany({
            where: {
                userId: id
            },
            select: {
                problemId: true
            }
        })
        const solvedProblemIds = solvedProblems.map((e) => e.problemId)
        res.status(200).json({ solvedProblemIds })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to get solved problems' })
    }
}

export const syncLeetCodeSolvedProblems = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { leetcodeUsername: true }
        });

        if (!user || !user.leetcodeUsername) {
            return {
                success: false,
                message: 'LeetCode username not set'
            };
        }

        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                    submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
                recentAcSubmissionList(username: $username, limit: 1000) {
                    title
                    titleSlug
                    timestamp
                }
            }
        `;

        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username: user.leetcodeUsername }
        });

        if (response.data.errors || !response.data.data.matchedUser) {
            return {
                success: false,
                message: 'Failed to fetch LeetCode data'
            };
        }

        const recentSubmissions = response.data.data.recentAcSubmissionList || [];

        const solvedTitles = new Set();
        const solvedSlugs = new Set();

        recentSubmissions.forEach(sub => {
            solvedTitles.add(sub.title);
            solvedSlugs.add(sub.titleSlug);
        });

        const dbProblems = await prisma.problem.findMany({
            where: {
                platform: 'LEETCODE',
                OR: [
                    { title: { in: Array.from(solvedTitles) } },
                ]
            },
            select: { id: true, title: true, problemId: true }
        });

        const titleToSlug = (title) => {
            return title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        };
        const matchedProblems = dbProblems.filter(p => {
            const slug = titleToSlug(p.title);
            return solvedSlugs.has(slug) || solvedTitles.has(p.title);
        });

        let newCount = 0;
        for (const problem of matchedProblems) {
            const result = await prisma.solvedProblem.upsert({
                where: {
                    userId_problemId: {
                        userId: userId,
                        problemId: problem.id
                    }
                },
                create: {
                    userId: userId,
                    problemId: problem.id
                },
                update: {}
            });

            if (result.solvedAt.getTime() > Date.now() - 1000) {
                newCount++;
            }
        }

        return {
            success: true,
            totalSynced: matchedProblems.length,
            newProblems: newCount,
            message: `Synced ${matchedProblems.length} problems (${newCount} new)`
        };
    } catch (err) {
        console.error('LeetCode sync error:', err);
        return {
            success: false,
            message: 'Failed to sync LeetCode problems',
            error: err.message
        };
    }
};
