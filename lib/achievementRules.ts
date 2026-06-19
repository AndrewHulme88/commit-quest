export function getSyncAchievementKeys(user: {
    xp: number;
    level: number;
    streak: number;
}) {
    const achievements: string[] = [];

    if (user.xp > 0) achievements.push("first_xp");
    if (user.xp >= 100) achievements.push("xp_100");
    if (user.level >= 5) achievements.push("level_5");
    if (user.streak >= 3) achievements.push("streak_3");

    return achievements;
}