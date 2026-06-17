import { describe, expect, it } from "vitest";
import { getXpForNextLevel, calculateLevel } from "./xp";

describe("XP logic", () => {
    it("Calculate level from total XP", () => {
        expect(calculateLevel(0)).toBe(1);
        expect(calculateLevel(99)).toBe(1);
        expect(calculateLevel(100)).toBe(2);
        expect(calculateLevel(281)).toBe(2);
        expect(calculateLevel(282)).toBe(3);
    });

    it("Calculate XP needed for next level", () => {
        expect(getXpForNextLevel(1)).toBe(100);
        expect(getXpForNextLevel(2)).toBe(282);
        expect(getXpForNextLevel(3)).toBe(519);
    });
})