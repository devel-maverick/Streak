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

        const contests = await prisma.contest.findMany({
            where,
            orderBy: {
                startTime: "asc"
            }
        })

        const events = contests.map((c) => ({
            id: c.id,
            title: `${c.title}.toUpperCase()`,
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

export const updateContestPhase=async()=>{
    try{
        const now=new Date()
        const contests=await prisma.contest.findMany({
            where:{
                OR:[
                {phase:"BEFORE",startTime:{lte:now}},
                {phase:"CODING",endTime:{gte:now}}
                ]
            }
        })
        let updated=0
        for(const c of contests){
            const newphase=c.phase
            if (now>c.endTime) newphase="ENDED"
            else if (now>c.startTime) newphase="CODING"

            if (newphase!==c.phase){
                await prisma.contest.update({
                where:{
                    id:c.id
                },
                data:{
                    phase:newphase
                }
            })
                updated++
            }
        }
        return updated
    }catch(err){
        console.log(err)
    }
}



const fetchCodeforcesContests=async()=>{
    try{
        const {data}=await axios.get("https://codeforces.com/api/contest.list",{params:{gym:false},timeout:10000})
        if(data.status!=="OK"){
            return []
        }
        const now=new Date()
        return data.result.filter((c)=>c.phase==="BEFORE" || c.phase==="CODING")
        .slice(0,30)
        .map((c)=>{
            const startTime=new Date(c.startTimeSeconds*1000)
            const endTime=new Date(startTime.getTime()+c.durationSeconds*1000)
            const duration=Math.round(c.durationSeconds/60)
            let phase="BEFORE"
            if(now>=startTime && now<=endTime) phase="CODING"
            else if(now>endTime) phase="ENDED"
            return {
                title:c.name,
                platform:"CODEFORCES",
                contestId:c.id,
                startTime,
                endTime,
                duration,
                phase,
                url:`https://codeforces.com/contest/${c.id}`
            }
        })
    }catch(err){
        console.log(err)
        return []
    }

}

const fetchLeetcodeContests=async()=>{
        try{
        const {data}=await axios.get("https://kontests.net/api/v1/leet_code",{timeout:10000})
        if(data.status!=="OK"){
            return []
        }
        const now=new Date()
        return data.result.filter((c)=>c.phase==="BEFORE" || c.phase==="CODING")
        .slice(0,30)
        .map((c)=>{
            const startTime=new Date(c.startTimeSeconds*1000)
            const endTime=new Date(startTime.getTime()+c.durationSeconds*1000)
            const duration=Math.round(c.durationSeconds/60)
            let phase="BEFORE"
            if(now>=startTime && now<=endTime) phase="CODING"
            else if(now>endTime) phase="ENDED"
            return {
                title:c.name,
                platform:"LEETCODE",
                contestId:c.id,
                startTime,
                endTime,
                duration,
                phase,
                url:`https://leetcode.com/contest/${c.id}`
            }
        })
    }catch(err){
        console.log(err)
        return []
    }

}

const fetchCodechefContests=async()=>{
        try{
        const {data}=await axios.get("https://kontests.net/api/v1/code_chef",{timeout:10000})
        if(data.status!=="OK"){
            return []
        }
        const now=new Date()
        return data.result.filter((c)=>c.phase==="BEFORE" || c.phase==="CODING")
        .slice(0,30)
        .map((c)=>{
            const startTime=new Date(c.startTimeSeconds*1000)
            const endTime=new Date(startTime.getTime()+c.durationSeconds*1000)
            const duration=Math.round(c.durationSeconds/60)
            let phase="BEFORE"
            if(now>=startTime && now<=endTime) phase="CODING"
            else if(now>endTime) phase="ENDED"
            return {
                title:c.name,
                platform:"CODECHEF",
                contestId:c.id,
                startTime,
                endTime,
                duration,
                phase,
                url:`https://codechef.com/contest/${c.id}`
            }
        })
    }catch(err){
        console.log(err)
        return []
    }

}

const fetchAtcoderContests=async()=>{
        try{
        const {data}=await axios.get("https://kontests.net/api/v1/at_coder",{timeout:10000})
        if(data.status!=="OK"){
            return []
        }
        const now=new Date()
        return data.result.filter((c)=>c.phase==="BEFORE" || c.phase==="CODING")
        .slice(0,30)
        .map((c)=>{
            const startTime=new Date(c.startTimeSeconds*1000)
            const endTime=new Date(startTime.getTime()+c.durationSeconds*1000)
            const duration=Math.round(c.durationSeconds/60)
            let phase="BEFORE"
            if(now>=startTime && now<=endTime) phase="CODING"
            else if(now>endTime) phase="ENDED"
            return {
                title:c.name,
                platform:"ATCODER",
                contestId:c.id,
                startTime,
                endTime,
                duration,
                phase,
                url:`https://atcoder.com/contests/${c.id}`
            }
        })
    }catch(err){
        console.log(err)
        return []
    }

}