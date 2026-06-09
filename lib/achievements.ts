import { prisma } from "@/lib/prisma";

export async function unlockAchievement(userId: string, key: string) {
    const achievement = await prisma.achievement.findUnique({
        where: { key },
    });

    if (!achievement) return null;

    return prisma.userAchievement.upsert({
        where: {
            userId_achievementId: {
                userId,
                achievementId: achievement.id,
            },
        },
        update: {},
        create: {
            userId,
            achievementId: achievement.id,
        },
    });    
}

export async function checkSyncAchievements(user: {
    id: string;
    xp: number;
    level: number;
    streak: number;
}) {
    if (user.xp > 0) await unlockAchievement(user.id, "first_xp");
    if (user.xp >= 100) await unlockAchievement(user.id, "xp_100");
    if (user.level >= 5) await unlockAchievement(user.id, "level_5");
    if (user.streak >= 3) await unlockAchievement(user.id, "streak_3");
}