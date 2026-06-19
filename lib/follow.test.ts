import { describe, expect, it } from "vitest";
import { canFollowUser } from "./follow";

describe("Follow logic", () => {
    it("Allows a user to follow another user", () => {
        expect(canFollowUser("user-1", "user-2")).toBe(true);
    });

    it("Does not allow a user to follow themselves", () => {
        expect(canFollowUser("user-1", "user-1")).toBe(false);
    });
});