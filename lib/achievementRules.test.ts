import { describe, expect, it } from "vitest";
import { getSyncAchievementKeys } from "./achievementRules";
import { get } from "http";

describe("Achievement rules", () => {
    it("Returns no achievements for a brand new user", () => {
        expect(
            getSyncAchievementKeys({
                xp: 0,
                level: 1,
                streak: 0,
            })
        ).toEqual([]);
    });

    it("Unlocks first XP achievement when user has XP", () => {
        expect(
            getSyncAchievementKeys({
                xp: 10,
                level: 1,
                streak: 0,
            })
        ).toContain("first_xp");
    });

    it("Unlocks 100 XP achievement when user has 100 XP", () => {
        expect(
            getSyncAchievementKeys({
                xp: 100,
                level: 2,
                streak: 0
            })
        ).toContain("xp_100");
    });

    it("Unlocks level 5 achievement when user is level 5", () => {
        expect(
            getSyncAchievementKeys({
                xp: 1000,
                level: 5,
                streak: 0,
            })
        ).toContain("level_5");
    });

    it("Unlocks streak 3 achievement when user has a 3 day streak", () => {
        expect(
            getSyncAchievementKeys({
                xp: 100,
                level: 2,
                streak: 3,
            })
        ).toContain("streak_3");
    });

    it("Unlocks multiple achievements when multiple conditions are met", () => {
        expect(
            getSyncAchievementKeys({
                xp: 1000,
                level: 5,
                streak: 3,
            })
        ).toEqual(["first_xp", "xp_100", "level_5", "streak_3"]);
    });
});