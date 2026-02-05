import fs from "fs";
import path from "path";
import prisma from "../config/db.js";


const DATA_DIR = path.join(process.cwd(), "data2");
const PLATFORM = 'CSES'
const parseCSV = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
};


const importCompanyCSV = async (filePath) => {
    const text = fs.readFileSync(filePath, 'utf-8')
    const lines = text.trim().split('\n')

    if (lines.length < 2) {
        return
    }
    const header = lines[0].toLowerCase().split(",")
    const index = (name) => header.indexOf(name)
    let inserted = 0
    for (let i = 1; i < lines.length; i++) {
        const row = parseCSV(lines[i])
        const problemId = row[index("id")]
        const title = row[index("title")]
        const existing = await prisma.problem.findUnique({
            where: {
                platform_problemId: {
                    platform: PLATFORM,
                    problemId
                }
            }
        })
        if (existing) {
            continue
        }
        else {
            const problem = await prisma.problem.create({
                data: {
                    platform: PLATFORM,
                    problemId,
                    title,
                    url: `https://cses.fi/problemset/task/${problemId}`,
                    companies: []
                }
            })
            inserted++
        }
    }
    console.log(`Inserted ${inserted} problems`)
}

const run = async () => {
    const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith('.csv'))
    for (const file of files) {
        const filePath = path.join(DATA_DIR, file);
        await importCompanyCSV(filePath);
    }
    console.log("All company CSVs imported successfully");
    process.exit(0);
}
run()