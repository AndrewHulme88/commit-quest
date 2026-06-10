import { prisma } from "@/lib/prisma";

export async function unlockAchievement(userId: string, key: string) {
    const achievement = await prisma.achievement.findUnique({
        where: { key },
    });

    if (!achievement) return null;

    // return prisma.userAchievement.upsert({
    //     where: {
    //         userId_achievementId: {
    //             userId,
    //             achievementId: achievement.id,
    //         },
    //     },
    //     update: {},
    //     create: {
    //         userId,
    //         achievementId: achievement.id,
    //     },
    // });    

    const existing = await prisma.userAchievement.findUnique({
        where: {
            userId_achievementId: {
                userId,
                achievementId: achievement.id,
            },
        },
    });

    if (existing) return null;

    const unlocked = await prisma.userAchievement.create({
        data: {
            userId,
            achievementId: achievement.id,
        },
        include: {
            achievement: true,
        },
    });

    return unlocked;
}

export async function checkSyncAchievements(user: {
    id: string;
    xp: number;
    level: number;
    streak: number;
}) {
    const unlockedAchievements = []

    if (user.xp > 0) {
        const achievement = await unlockAchievement(user.id, "first_xp");
        if (achievement) unlockedAchievements.push(achievement);
    }

    if (user.xp >= 100) {
        const achievement = await unlockAchievement(user.id, "xp_100");
        if (achievement) unlockedAchievements.push(achievement);
    }

    if (user.level >= 5) {
        const achievement = await unlockAchievement(user.id, "level_5");
        if (achievement) unlockedAchievements.push(achievement);
    }

    if (user.streak >= 3) {
        const achievement = await unlockAchievement(user.id, "streak_3");
        if (achievement) unlockedAchievements.push(achievement);
    }
}