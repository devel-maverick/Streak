
export const markSolved=async(req,res)=>{

    try{
        const id=req.user.id
        const {problemId}=req.params
        const problem=await prisma.problem.findunique({
            where:{
                problemId
            }
        })
        if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
        await prisma.SolvedProblem.upsert({
            where:{
                userId_problemId:{
                    userId:id,
                    problemId
                }
            },
            create:{
                userId:id,
                problemId:problem.id,
            }
            ,update:{}
        })

        res.status(200).json({message:"Problem marked as solved"})


    }catch(err){
        console.log(err)
        res.status(500).json({message:'Failed to mark problem as solved'})
    }
}

export const getSolved=async(req,res)=>{
    try{
        const id=req.user.id
        const solvedProblems=await prisma.SolvedProblem.findMany({
            where:{
                userId:id
            },
            select:{
                problemId:true
            }
        })
        const solvedProblemIds=solvedProblems.map((e)=>e.problemId)
        res.status(200).json({solvedProblemIds})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Failed to get solved problems'})
    }
}