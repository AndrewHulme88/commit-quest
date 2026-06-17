type CalculateStreakInput = {
    currentStreak: number;
    highestStreak: number;
    lastActivityDate: Date | null;
    hasNewActivity: boolean;
    today?: Date;
};

export function calculateStreak({
    currentStreak,
    highestStreak,
    lastActivityDate,
    hasNewActivity,
    today = new Date(),
}: CalculateStreakInput) {
    if (!hasNewActivity) {
        return {
            streak: currentStreak,
            highest_streak: highestStreak,
        };
    }

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    let streak = currentStreak;
    let highest_streak = highestStreak ?? 0;

    if (!lastActivityDate) {
        streak = 1;
    } else {
        const lastActivityStart = new Date(lastActivityDate);
        lastActivityStart.setHours(0, 0, 0, 0);

        const yesterday = new Date(todayStart);
        yesterday.setDate(todayStart.getDate() - 1);

        if (lastActivityStart.getTime() === yesterday.getTime()) {
            streak += 1;
        } else if (lastActivityStart.getTime() === todayStart.getTime()) {
            streak = currentStreak;
        } else {
            streak = 1;
        }
    }

    highest_streak = Math.max(highest_streak, streak);

    return {
        streak,
        highest_streak,
    };
}