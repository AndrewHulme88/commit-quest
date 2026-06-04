import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    await prisma.user.createMany({
        data: [
            {
                githubId: "dummy-1",
                name: "Pixel Wizard",
                email: "pixel@example.com",
                image: "https://avatars.githubusercontent.com/merge-mage",
                xp: 1240,
                level: 6,
                streak: 4,
                highest_streak: 12,
            },
            {
                githubId: "dummy-2",
                name: "Bug Slayer",
                email: "bug@example.com",
                image: "https://avatars.githubusercontent.com/bug-slayer",
                xp: 860,
                level: 4,
                streak: 7,
                highest_streak: 9,
            },
            {
                githubId: "dummy-3",
                name: "Merge Mage",
                email: "merge@example.com",
                image: "https://avatars.githubusercontent.com/merge-mage",
                xp: 2120,
                level: 9,
                streak: 2,
                highest_streak: 18,
            },
        ],
        skipDuplicates: true,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });