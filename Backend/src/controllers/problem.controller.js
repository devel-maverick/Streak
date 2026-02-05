
export const listProblems=async(req,res)=>{
    try{
        let {platform,company,limit,page}=req.query
        page=parseInt(page)
        if(!page||page<1) page=1

        limit=parseInt(limit)
        if(!limit||limit<1) limit=10
        if(limit>50) limit=50

        const skip=(page-1)*limit
        const where={}
        if(platform) where.platform=platform
        if(company) where.companies={has:company}

        const problems=await prisma.problem.findMany({
            where,
            skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        })
        const total=await prisma.problem.count({where})
        const totalPages=Math.ceil(total/limit)
        res.json({
            data:problems,
            meta:{
                page,
                limit,
                total,
                totalPages
            }
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Failed to fetch problems'})
    }
}



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


export const getByPlatform=async(req,res)=>{
    try{
        const {platform}=req.params
        let {limit,page}=req.query
        page=parseInt(page)
        if(!page||page<1) page=1

        limit=parseInt(limit)
        if(!limit||limit<1) limit=10
        if(limit>50) limit=50

        const skip=(page-1)*limit
        const where={}
        if(platform) where.platform=platform

        const problems=await prisma.problem.findMany({
            where,
            skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        })
        const total=await prisma.problem.count({where})
        const totalPages=Math.ceil(total/limit)
        res.json({
            data:problems,
            meta:{
                page,
                limit,
                total,
                totalPages
            }
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Failed to fetch problems'})
    }
}

export const getByCompany=async(req,res)=>{
    try{
        const {company}=req.params
        let {limit,page}=req.query
        page=parseInt(page)
        if(!page||page<1) page=1

        limit=parseInt(limit)
        if(!limit||limit<1) limit=10
        if(limit>50) limit=50

        const skip=(page-1)*limit
        const where={}
        if(company) where.companies={has:company}

        const problems=await prisma.problem.findMany({
            where,
            skip,
            take:limit,
            orderBy:{createdAt:'desc'}
        })
        const total=await prisma.problem.count({where})
        const totalPages=Math.ceil(total/limit)
        res.json({
            data:problems,
            meta:{
                page,
                limit,
                total,
                totalPages
            }
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Failed to fetch problems'})
    }
}


