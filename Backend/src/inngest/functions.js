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

export const alljobs = [importContestsJob, updateContestPhaseJob];
