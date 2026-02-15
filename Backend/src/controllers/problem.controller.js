import prisma from "../config/db.js";

export const getPracticeProblems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const platform = req.query.platform;
        const minRating = req.query.minRating ? parseInt(req.query.minRating) : undefined;
        const maxRating = req.query.maxRating ? parseInt(req.query.maxRating) : undefined;

        const skip = (page - 1) * limit;

        const where = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { topics: { hasSome: [search, search.toLowerCase(), search.toUpperCase(), search.charAt(0).toUpperCase() + search.slice(1)] } }
            ];
        }

        if (platform) {
            const platforms = platform.split(',').map(p => p.trim().toUpperCase());
            where.platform = { in: platforms };
        }

        if (minRating !== undefined || maxRating !== undefined) {
            where.rating = {};
            if (minRating !== undefined) where.rating.gte = minRating;
            if (maxRating !== undefined) where.rating.lte = maxRating;
        }

        const total = await prisma.problem.count({ where });

        const problems = await prisma.problem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const statsGroup = await prisma.problem.groupBy({
            by: ['platform'],
            where: {
                platform: { in: ['CODEFORCES', 'CSES'] }
            },
            _count: { platform: true }
        });

        const stats = {
            total: 0,
            codeforces: 0,
            cses: 0,
            leetcode: 0
        };

        statsGroup.forEach(item => {
            if (item.platform === 'CODEFORCES') stats.codeforces = item._count.platform;
            if (item.platform === 'CSES') stats.cses = item._count.platform;
            if (item.platform === 'LEETCODE') stats.leetcode = item._count.platform;
        });
        stats.total = stats.codeforces + stats.cses;

        let solvedProblemIds = new Set();
        let userSolvedCounts = {
            total: 0,
            codeforces: 0,
            cses: 0
        };

        if (req.user) {
            const solved = await prisma.solvedProblem.findMany({
                where: { userId: req.user.id },
                include: { problem: true }
            });

            solved.forEach(s => {
                solvedProblemIds.add(s.problemId);
                if (s.problem.platform === 'CODEFORCES') userSolvedCounts.codeforces++;
                if (s.problem.platform === 'CSES') userSolvedCounts.cses++;
            });
            userSolvedCounts.total = userSolvedCounts.codeforces + userSolvedCounts.cses;
        }

        const problemsWithSolvedStatus = problems.map(problem => ({
            ...problem,
            isSolved: solvedProblemIds.has(problem.id)
        }));

        res.json({
            problems: problemsWithSolvedStatus,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            stats,
            userSolvedCounts
        });

    } catch (error) {
        console.error("Error fetching practice problems FULL ERROR:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getById = async (req, res) => {
    try {
        const problem = await prisma.problem.findUnique({
            where: { id: req.params.id },
        });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: "Error fetching problem" });
    }
};


export const getPracticeByPlatform = async (req, res) => {
    try {
        const { platform } = req.params;
        let { limit, page } = req.query;

        page = parseInt(page);
        if (!page || page < 1) page = 1;

        limit = parseInt(limit);
        if (!limit || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const where = {
            platform,
            companies: { isEmpty: true },
        };

        const problems = await prisma.problem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.problem.count({ where });

        res.json({
            data: problems,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch practice problems" });
    }
};








export const getCompanyProblems = async (req, res) => {
    try {
        let { page, limit, company, difficulty, topics, search } = req.query;

        // Pagination
        page = parseInt(page);
        if (!page || page < 1) page = 1;

        limit = parseInt(limit);
        if (!limit || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const where = {
            company: { not: null },
            platform: "LEETCODE"
        };

        if (company) {
            where.company = company.toLowerCase();
        }

        if (difficulty) {
            where.difficulty = difficulty.toUpperCase();
        }

        if (topics) {
            where.topics = { hasSome: [topics.toLowerCase()] };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { topics: { hasSome: [search, search.toLowerCase(), search.toUpperCase(), search.charAt(0).toUpperCase() + search.slice(1)] } }
            ];
        }

        const problems = await prisma.problem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.problem.count({ where });

        const allProblemsWithCompanies = await prisma.problem.findMany({
            where: {
                company: { not: null },
                platform: "LEETCODE"
            },
            select: { difficulty: true }
        });

        const stats = {
            total: allProblemsWithCompanies.length,
            easy: allProblemsWithCompanies.filter(p => p.difficulty === 'EASY').length,
            medium: allProblemsWithCompanies.filter(p => p.difficulty === 'MEDIUM').length,
            hard: allProblemsWithCompanies.filter(p => p.difficulty === 'HARD').length
        };

        let solvedProblemIds = new Set();
        if (req.user && req.user.id) {
            const solvedProblems = await prisma.solvedProblem.findMany({
                where: { userId: req.user.id },
                select: { problemId: true }
            });
            solvedProblemIds = new Set(solvedProblems.map(sp => sp.problemId));
        }

        const problemsWithSolvedStatus = problems.map(problem => ({
            ...problem,
            isSolved: solvedProblemIds.has(problem.id)
        }));

        res.json({
            data: problemsWithSolvedStatus,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                stats
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch company problems' });
    }
};
