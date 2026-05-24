// xp needed to reach the next level
export function getXpForNextLevel(level: number) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

// calculate the user's current level based on total XP
export function calculateLevel(totalXp: number) {
    let level = 1;

    while (totalXp >= getXpForNextLevel(level)) {
        level++;
    }

    return level;
}