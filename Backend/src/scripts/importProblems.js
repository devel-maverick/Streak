import fs from "fs";
import path from "path";
import prisma from "../config/db.js";

const DATA_DIR=path.join(process.cwd(),"data");
const PLATFORM='LEETCODE'

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


const importCompanyCSV=async(filePath,company)=>{
    const text=fs.readFileSync(filePath,'utf-8')
    const lines=text.trim().split('\n')

    if(lines.length<2){
        return 
    }
    const header=lines[0].toLowerCase().split(",")
    const index=(name)=>header.indexOf(name)
    let upserted=0
    let inserted=0
    for (let i=1;i<lines.length;i++){
        const row=parseCSV(lines[i])


        const problemId=row[index("id")]
        const title=row[index("title")]
        const url=row[index("url")]
        const difficulty=row[index("difficulty")].toUpperCase()
        const acceptance=parseFloat(row[index("acceptance")])
        const frequency=parseFloat(row[index("frequency")])
        const topics=row[index("topics")].split(",").map((t) => t.trim().toLowerCase())

        const existing=await prisma.problem.findUnique({
            where:{
                platform_problemId:{
                    platform:PLATFORM,
                    problemId
                }
            }
        })
        if(!existing){
            const problem=await prisma.problem.create({
                data:{
                    platform:PLATFORM,
                    problemId,
                    title,
                    url,
                    difficulty,
                    acceptance,
                    frequency,
                    topics,
                    companies:[company]
                }
            })
            inserted++
        }else{
            upserted++
            const newcompany= new Set(existing.companies)
            newcompany.add(company)
            await prisma.problem.update({
                where:{
                    id:existing.id,
                },
                data:{
                    companies: Array.from(newcompany)
                }
            })
        }
    }
    console.log(`Inserted ${inserted} problems`)
    console.log(`Upserted ${upserted} problems`)
}

const run=async()=>{
    const files=fs.readdirSync(DATA_DIR).filter((file)=>file.endsWith('.csv'))
    for(const file of files){
        const company = file.replace(".csv", "").toLowerCase();
        const filePath = path.join(DATA_DIR, file);
        await importCompanyCSV(filePath, company);
    }
    console.log("All company CSVs imported successfully");
    process.exit(0);
}
run()