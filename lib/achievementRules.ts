export function getSyncAchievementKeys(user: {
    xp: number;
    level: number;
    streak: number;
}) {
    const achievements: string[] = [];

    // Xp
    if (user.xp > 0) achievements.push("first_xp");
    if (user.xp >= 100) achievements.push("xp_100");
    if (user.xp >= 500) achievements.push("xp_500");
    if (user.xp >= 1000) achievements.push("xp_1000");
    if (user.xp >= 5000) achievements.push("xp_5000");

    // Levels
    if (user.level >= 5) achievements.push("level_5");
    if (user.level >= 10) achievements.push("level_10");
    if (user.level >= 25) achievements.push("level_25");

    // Streaks
    if (user.streak >= 3) achievements.push("streak_3");
    if (user.streak >= 7) achievements.push("streak_7");
    if (user.streak >= 14) achievements.push("streak_14");
    if (user.streak >= 30) achievements.push("streak_30");

    return achievements;
}