import axios from "axios";
import prisma from "../config/db.js";

export const getAllContests = async (req, res) => {
    try {
        const { platform } = req.query

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
            title: c.title,
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
export const importContests = async (req, res) => {
    try {
        const { platform } = req.body
        const fetchers = [];
        if (!platform || platform === "codeforces") fetchers.push({ name: 'codeforces', fn: fetchCodeforcesContests });
        const results = await Promise.allSettled(fetchers.map(f => f.fn().then(data => ({ name: f.name, data }))));

        let allContests = [];
        results.forEach((result, idx) => {
            if (result.status === 'fulfilled') {
                allContests.push(...result.value.data);
            } else {
                console.error(`Failed to fetch from ${fetchers[idx].name}:`, result.reason);
            }
        });

        if (allContests.length === 0) {
            return res.status(500).json({ message: "Failed to fetch any contests", details: results.map(r => r.status === 'rejected' ? r.reason.message : 'No data') });
        }

        let inserted = 0;
        let errors = 0;
        for (const c of allContests) {
            try {
                await prisma.Contest.upsert({
                    where: {
                        platform_contestId: {
                            platform: c.platform.toUpperCase(),
                            contestId: String(c.contestId)
                        }
                    },
                    create: {
                        title: c.title,
                        platform: c.platform.toUpperCase(),
                        contestId: String(c.contestId),
                        url: c.url,
                        startTime: c.startTime,
                        endTime: c.endTime,
                        duration: c.duration,
                        phase: c.phase,
                    },
                    update: {
                        title: c.title,
                        startTime: c.startTime,
                        endTime: c.endTime,
                        duration: c.duration,
                        phase: c.phase,
                        url: c.url
                    }
                });
                inserted++;
            } catch (upsertErr) {
                console.error(`Upsert failed for ${c.platform} ${c.contestId}:`, upsertErr.message);
                errors++;
            }
        }

        res.json({
            message: "Contests sync completed",
            inserted,
            itemErrors: errors,
            totalFetched: allContests.length,
            platformsTried: fetchers.map(f => f.name)
        });

    } catch (err) {
        console.log("Global Import Error:", err)
        res.status(500).json({ message: "Contest import failed critically" });
    }
}

export const updateContestPhase = async () => {
    try {
        const now = new Date()
        const contests = await prisma.contest.findMany({
            where: {
                OR: [
                    { phase: "BEFORE", startTime: { lte: now } },
                    { phase: "CODING", endTime: { gte: now } }
                ]
            }
        })
        let updated = 0
        for (const c of contests) {
            const newphase = c.phase
            if (now > c.endTime) newphase = "ENDED"
            else if (now > c.startTime) newphase = "CODING"

            if (newphase !== c.phase) {
                await prisma.contest.update({
                    where: {
                        id: c.id
                    },
                    data: {
                        phase: newphase
                    }
                })
                updated++
            }
        }
        return updated
    } catch (err) {
        console.log(err)
    }
}



const fetchCodeforcesContests = async () => {
    try {
        const { data } = await axios.get("https://codeforces.com/api/contest.list", { params: { gym: false }, timeout: 10000 })
        if (data.status !== "OK") {
            return []
        }
        const now = new Date()
        return data.result.filter((c) => c.phase === "BEFORE" || c.phase === "CODING")
            .slice(0, 30)
            .map((c) => {
                const startTime = new Date(c.startTimeSeconds * 1000)
                const endTime = new Date(startTime.getTime() + c.durationSeconds * 1000)
                const duration = Math.round(c.durationSeconds / 60)
                let phase = "BEFORE"
                if (now >= startTime && now <= endTime) phase = "CODING"
                else if (now > endTime) phase = "ENDED"
                return {
                    title: c.name,
                    platform: "CODEFORCES",
                    contestId: String(c.id),
                    startTime,
                    endTime,
                    duration,
                    phase,
                    url: `https://codeforces.com/contest/${c.id}`
                }
            })
    } catch (err) {
        console.log("CF Fetch Error:", err.message)
        return []
    }

}