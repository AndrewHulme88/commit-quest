import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    // Create dummy users
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

    // Generate achievements
    await prisma.achievement.createMany({
        data: [
            // XP
            {
                key: "first_xp",
                name: "First Step",
                description: "Earn your first XP",
                icon: "🌱",
            },
            {
                key: "xp_100",
                name: "Getting Started",
                description: "Earn 100 total XP",
                icon: "⚡️",
            },
            {
                key: "xp_500",
                name: "Momentum Builder",
                description: "Earn 500 total XP",
                icon: "🚀",
            },
            {
                key: "xp_1000",
                name: "XP Hunter",
                description: "Earn 1000 total XP",
                icon: "💎",
            },
            {
                key: "xp_5000",
                name: "Grind Master",
                description: "Earn 5000 total XP",
                icon: "👑",
            },

            // Levels
            {
                key: "level_5",
                name: "Level 5",
                description: "Reach level 5",
                icon: "🎉",
            },
            {
                key: "level_10",
                name: "Level 10",
                description: "Reach level 10",
                icon: "🏅",
            },
            {
                key: "level_25",
                name: "Level 25",
                description: "Reach level 25",
                icon: "🏆",
            },

            // Streaks
            {
                key: "streak_3",
                name: "Streak Starter",
                description: "Maintain a 3 day streak",
                icon: "🔥",
            },
            {
                key: "streak_7",
                name: "Weekly Warrior",
                description: "Maintain a 7 day streak",
                icon: "⚔️",
            },
            {
                key: "streak_14",
                name: "Fortnight Focus",
                description: "Maintain a 14 day streak",
                icon: "🗓️",
            },
            {
                key: "streak_30",
                name: "Consistency Champion",
                description: "Maintain a 30 day streak",
                icon: "📈",
            },

            // Social Following
            {
                key: "first_follow",
                name: "Greetings",
                description: "Follow another developer",
                icon: "🤝",
            },
            {
                key: "following_5",
                name: "Social Dev",
                description: "Follow 5 developers",
                icon: "😎",
            },
            {
                key: "following_10",
                name: "Social Butterfly",
                description: "Follow 10 developer",
                icon: "🦋",
            },

            // Social followers
            {
                key: "followers_1",
                name: "First Follower",
                description: "Gain your first follower",
                icon: "👋",
            },
            {
                key: "followers_5",
                name: "Making an Impression",
                description: "Gain 5 followers",
                icon: "👀",
            },
            {
                key: "followers_10",
                name: "Popular Dev",
                description: "Gain 10 followers",
                icon: "🎊",
            },
        ],
        skipDuplicates: true,
    })
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