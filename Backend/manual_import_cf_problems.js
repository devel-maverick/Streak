
import axios from 'axios';
import prisma from './src/config/db.js';

async function importProblems() {
    try {
        try {
            const response = await axios.get('https://codeforces.com/api/problemset.problems');
            if (response.data.status === 'OK') {
                const problems = response.data.result.problems;
                console.log(`Found ${problems.length} CF problems. Importing first 1000...`);
                let cfCount = 0;
                const chunkSize = 50;
                const limit = 1200;
                for (let i = 0; i < problems.length; i += chunkSize) {
                    if (i >= limit) break;

                    const chunk = problems.slice(i, i + chunkSize);
                    const promises = chunk.map(async (p) => {
                        const problemId = `CF-${p.contestId}${p.index}`;

                        let difficulty = 'MEDIUM';
                        if (p.rating) {
                            if (p.rating < 1200) difficulty = 'EASY';
                            else if (p.rating >= 1600) difficulty = 'HARD';
                        }

                        const url = `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`;

                        try {
                            await prisma.problem.upsert({
                                where: {
                                    platform_problemId_company: {
                                        platform: 'CODEFORCES',
                                        problemId: problemId,
                                        company: ''
                                    }
                                },
                                update: {
                                    title: p.name,
                                    topics: p.tags,
                                    difficulty,
                                    rating: p.rating || null,
                                    url
                                },
                                create: {
                                    problemId,
                                    title: p.name,
                                    topics: p.tags,
                                    difficulty,
                                    platform: 'CODEFORCES',
                                    url,
                                    description: '',
                                    rating: p.rating || null,
                                    acceptance: 0,
                                    frequency: 0,
                                    company: '',
                                }
                            });
                            cfCount++;
                        } catch (e) {
                        }
                    });

                    await Promise.all(promises);
                    process.stdout.write(`\rImported ${cfCount} CF problems...`);
                }
                console.log(`\nFinished CF Import. Total: ${cfCount}`);
            }
        } catch (e) {
            console.error("CF Import Failed:", e.message);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

importProblems();
