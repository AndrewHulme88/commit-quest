import { describe, expect, it } from "vitest";
import { calculateStreak } from "./streak";

describe("Streak logic", () => {
    const today = new Date("2026-06-17T12:00:00");

    it("Keeps streak unchanged when there is no new activity", () => {
        const result = calculateStreak({
            currentStreak: 5,
            highestStreak: 8,
            lastActivityDate: new Date("2026-06-16T12:00:00"),
            hasNewActivity: false,
            today,
        });

        expect(result).toEqual({
            streak: 5,
            highest_streak: 8,
        });
    });

    it("Starts a streak when user has first activity", () => {
        const result = calculateStreak({
            currentStreak: 0,
            highestStreak: 0,
            lastActivityDate: null,
            hasNewActivity: true,
            today,
        });

        expect(result).toEqual({
            streak: 1,
            highest_streak: 1,
        });
    });

    it("Continues streak if last activity was yesterday", () => {
        const result = calculateStreak({
            currentStreak: 3,
            highestStreak: 5,
            lastActivityDate: new Date("2026-06-16T12:00:00"),
            hasNewActivity: true,
            today,
        });

        expect(result).toEqual({
            streak: 4,
            highest_streak: 5,
        });
    });

    it("Updates highest streak when current streak beats it", () => {
        const result = calculateStreak({
            currentStreak: 5, 
            highestStreak: 5,
            lastActivityDate: new Date("2026-06-16T12:00:00"),
            hasNewActivity: true,
            today,
        });

        expect(result).toEqual({
            streak: 6,
            highest_streak: 6,
        });
    });

    it("Does not increment streak twice on one day", () => {
        const result = calculateStreak({
            currentStreak: 4,
            highestStreak: 6,
            lastActivityDate: new Date("2026-06-17T12:00:00"),
            hasNewActivity: true,
            today,
        });

        expect(result).toEqual({
            streak: 4,
            highest_streak: 6,
        });
    });

    it("Resets streak to 1 after missing a day", () => {
        const result = calculateStreak({
            currentStreak: 7,
            highestStreak: 10,
            lastActivityDate: new Date("2026-06-14T12:00:00"),
            hasNewActivity: true,
            today,
        });

        expect(result).toEqual({
            streak: 1,
            highest_streak: 10,
        });
    });
});