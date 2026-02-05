export const getPracticeProblems = async (req, res) => {
  try {
    let { platform, limit, page } = req.query;

    page = parseInt(page);
    if (!page || page < 1) page = 1;

    limit = parseInt(limit);
    if (!limit || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    const where = {
      companies: { isEmpty: true },
    };

    if (platform) where.platform = platform;

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

