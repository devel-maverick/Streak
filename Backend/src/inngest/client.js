import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "streak",
    name: "Streak",
    eventKey: process.env.INNGEST_EVENT_KEY
});
