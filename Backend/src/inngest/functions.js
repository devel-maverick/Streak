import { inngest } from "./client.js";

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



export const alljobs = [syncPlatformStatsJob];
