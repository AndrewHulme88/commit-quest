import { prisma } from "@/lib/prisma";
import { getSyncAchievementKeys } from "./achievementRules";

export async function unlockAchievement(userId: string, key: string) {
    const achievement = await prisma.achievement.findUnique({
        where: { key },
    });

    if (!achievement) return null;  

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
    const keys = getSyncAchievementKeys(user);

    const unlocked = [];

    for (const key of keys) {
        unlocked.push(await unlockAchievement(user.id, key));
    }

    return unlocked.filter(Boolean);
}