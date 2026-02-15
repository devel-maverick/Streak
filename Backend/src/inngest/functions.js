import { inngest } from "./client.js";
import { importContests, updateContestPhase } from "../controllers/contest.controller.js";

export const importContestsJob = inngest.createFunction(
    {
        id: "fetch-contests",
        name: "Fetch Contests from Codeforces",
        concurrency: { limit: 1 },
    },
    {
        cron: "0 6 * * *",
    },
    async ({ event, step }) => {
        console.log("[Inngest] Starting daily contest fetch...");

        const result = await step.run("Import All Contests", async () => {
            return importContests(null);
        });

        console.log("[Inngest] Contest fetch complete:", JSON.stringify(result));
        return result;
    }
);

export const updateContestPhaseJob = inngest.createFunction(
    {
        id: "update-contest-phases",
        name: "Update Contest Phases",
        concurrency: { limit: 1 },
    },
    {
        cron: "0 * * * *",
    },
    async ({ event, step }) => {
        console.log("[Inngest] Updating contest phases...");

        const result = await step.run("Update Phases", async () => {
            return updateContestPhase();
        });

        console.log("[Inngest] Phase update complete:", JSON.stringify(result));
        return result;
    }
);

export const syncPlatformStatsJob = inngest.createFunction(
    {
        id: "sync-platform-stats",
        name: "Sync Platform Stats for All Users",
        concurrency: { limit: 1 },
    },
    {
        cron: "0 * * * *", // Every hour
    },
    async ({ event, step }) => {
        console.log("[Inngest] Starting platform stats sync...");

        const { syncAllUserStats } = await import("../controllers/stats.controller.js");

        const result = await step.run("Sync All User Stats", async () => {
            return syncAllUserStats();
        });

        console.log("[Inngest] Platform stats sync complete:", JSON.stringify(result));
        return result;
    }
);

export const syncLeetCodeSolvedJob = inngest.createFunction(
    {
        id: "sync-leetcode-solved",
        name: "Sync LeetCode Solved Problems for All Users",
        concurrency: { limit: 1 },
    },
    {
        cron: "0 * * * *", // Every hour
    },
    async ({ event, step }) => {
        console.log("[Inngest] Starting LeetCode solved problems sync...");

        const { syncLeetCodeSolvedProblems } = await import("../controllers/solved.controller.js");

        const result = await step.run("Sync All Users LeetCode Solved", async () => {
            // Get all users with LeetCode username
            const { default: prisma } = await import("../config/db.js");
            const users = await prisma.user.findMany({
                where: { leetcodeUsername: { not: null } },
                select: { id: true, leetcodeUsername: true }
            });

            console.log(`Syncing LeetCode solved for ${users.length} users`);
            let successCount = 0;
            let failedCount = 0;

            for (const user of users) {
                try {
                    const syncResult = await syncLeetCodeSolvedProblems(user.id);
                    if (syncResult.success) {
                        successCount++;
                        console.log(`✓ Synced ${user.leetcodeUsername}: ${syncResult.totalSynced} problems`);
                    } else {
                        failedCount++;
                        console.log(`✗ Failed to sync ${user.leetcodeUsername}: ${syncResult.message}`);
                    }
                } catch (err) {
                    failedCount++;
                    console.error(`✗ Error syncing ${user.leetcodeUsername}:`, err.message);
                }
            }

            return {
                success: true,
                totalUsers: users.length,
                successCount,
                failedCount
            };
        });

        console.log("[Inngest] LeetCode solved sync complete:", JSON.stringify(result));
        return result;
    }
);

export const alljobs = [importContestsJob, updateContestPhaseJob, syncPlatformStatsJob, syncLeetCodeSolvedJob];
