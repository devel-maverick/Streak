import axios from "axios";
import prisma from "../config/db.js";

export const getAllContests = async (req, res) => {
    try {
        const { platform } = req.query
        if (!platform) {
            return res.status(400).json({ message: "Platform is required" })
        }
        const where = {
            phase: { in: ["BEFORE", "CODING"] },
        };
        if (platform) {
            where.platform = platform.toUpperCase()
        }

        const contests = await prisma.Contest.findMany({
            where,
            orderBy: {
                startTime: "asc"
            }
        })

        const events = contests.map((c) => ({
            id: c.id,
            title: `[${c.platform.toUpperCase()}] ${c.title}`,
            startTime: c.startTime,
            endTime: c.endTime,
            duration: c.duration,
            platform: c.platform,
            url: c.url
        }))
        return res.status(200).json(events)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}


export const importContests=async(req,res)=>{
    try{
        const {platform}=req.body
        let contests=[]

        if (!platform || platform === "codeforces")
        contests.push(...(await fetchCodeforcesContests()));

        if (!platform || platform === "leetcode")
        contests.push(...(await fetchLeetcodeContests()));

        if (!platform || platform === "codechef")
        contests.push(...(await fetchCodechefContests()));

        if (!platform || platform === "atcoder")
        contests.push(...(await fetchAtcoderContests()));

    let inserted = 0;
    for (const c of contests){
        await prisma.Contest.upsert({
            where:{
                platform_contestId:{
                    platform:c.platform.toUpperCase(),
                    contestId:c.contestId
                }
            },
            create:{
          title: c.title,
          platform: c.platform.toUpperCase(),
          contestId: c.contestId,
          url: c.url,
          startTime: c.startTime,
          endTime: c.endTime,
          duration: c.duration,
          phase: c.phase,
                    },
            update:{
                title:c.title,
                startTime:c.startTime,
                endTime:c.endTime,
                duration:c.duration,
                phase:c.phase,
                url:c.url
            }
        })
        inserted++
    }
    res.json({
      message: "Contests synced",
      inserted,
      totalFetched: contests.length,
    });
    
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Contest import failed" });
    }
}