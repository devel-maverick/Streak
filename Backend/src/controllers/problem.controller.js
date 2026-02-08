import prisma from "../config/db.js";

export const getPracticeProblems = async (req, res) => {
    try {
        let { platform, limit, page, hasCompanies } = req.query;

        page = parseInt(page);
        if (!page || page < 1) page = 1;

        limit = parseInt(limit);
        if (!limit || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const where = {};

        if (hasCompanies === 'true') {
            where.companies = { isEmpty: false };
        } else if (hasCompanies === 'false') {
            where.companies = { isEmpty: true };
        }
        if (platform) where.platform = platform;

        const problems = await prisma.problem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.problem.count({ where });
        const statsGroup = await prisma.problem.groupBy({
            by: ['difficulty'],
            where,
            _count: {
                difficulty: true
            }
        });

        const stats = {
            total,
            easy: statsGroup.find(g => g.difficulty === 'EASY')?._count.difficulty || 0,
            medium: statsGroup.find(g => g.difficulty === 'MEDIUM')?._count.difficulty || 0,
            hard: statsGroup.find(g => g.difficulty === 'HARD')?._count.difficulty || 0,
        };


        res.json({
            data: problems,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                stats
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch practice problems" });
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

export const getByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        let { limit, page } = req.query;

        page = parseInt(page);
        if (!page || page < 1) page = 1;

        limit = parseInt(limit);
        if (!limit || limit < 1) limit = 10;
        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const where = {
            platform: "LEETCODE",
            companies: { has: company.toLowerCase() },
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
        res.status(500).json({ message: "Failed to fetch company problems" });
    }
};


export const getCompanies = async (req, res) => {
    try {
        const problems = await prisma.problem.findMany({
            select: { companies: true },
        });

        const companyCounts = {};
        problems.forEach((p) => {
            p.companies.forEach((company) => {
                const normalized = company.trim();
                // Simple normalization to title case or just trim
                if (normalized) {
                    companyCounts[normalized] = (companyCounts[normalized] || 0) + 1;
                }
            });
        });

        const result = Object.entries(companyCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch companies" });
    }
};

