"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FollowButton } from "./FollowButton";
import { ViewProfileButton } from "./ViewProfileButton";

type LeaderboardUser = {
    id: string;
    name: string | null;
    image: string | null;
    xp: number;
    weeklyXp?: number;
    level: number;
    streak: number;
    highest_streak: number;
};

type SortBy = "xp" | "weekly_xp" | "level" | "streak" | "highest_streak";
type Scope = "global" | "following";

const sortOptions: { label: string; value: SortBy }[] = [
    { label: "XP", value: "xp" },
    { label: "Weekly XP", value: "weekly_xp" },
    { label: "Level", value: "level" },
    { label: "Current Streak", value: "streak" },
    { label: "Highest Streak", value: "highest_streak" },
];

const scopeOptions: { label: string; value: Scope }[] = [
    { label: "Global", value: "global" },
    { label: "Following", value: "following"},
];

// This component displays the leaderboard with sorting options and follow buttons for each user
export function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [sort, setSort] = useState("xp");
    const [scope, setScope] = useState<Scope>("global");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadLeaderboard() {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/leaderboard?scope=${scope}&sort=${sort}`);

            if (!response.ok) {
                const data = await response.json();

                setUsers([]);
                setError(data.error ?? "Failed to load leaderboard");
                setLoading(false);
                return;
            }

            const data = await response.json();

            setUsers(Array.isArray(data) ? data : []);
            setLoading(false);
        }

        loadLeaderboard();
    }, [scope, sort]);

    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <p className="mt-1 text-sm text-zinc-400">
                    Compare your progress with other developers.
                </p>
                </div>
            </div>

            {!loading && error && (
                <p className="rounded-xl border border-red-900/50 bg-red-950/30 p-5 text-red-300">
                    {error}
                </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
                {scopeOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => setScope(option.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    scope === option.value
                        ? "bg-emerald-500 text-zinc-950"
                        : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                >
                    {option.label}
                </button>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => setSort(option.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    sort === option.value
                        ? "bg-zinc-100 text-zinc-950"
                        : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                >
                    {option.label}
                </button>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                {loading && (
                <p className="text-sm text-zinc-400">Loading leaderboard...</p>
                )}

                {!loading && users.length === 0 && (
                <p className="rounded-xl border border-zinc-800 bg-zinc-800 p-5 text-zinc-400">
                    {scope === "following"
                    ? "You are not following anyone yet."
                    : "No users found."}
                </p>
                )}

                {!loading &&
                users.map((user, index) => (
                    <div
                    key={user.id}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                    <div className="flex items-center gap-4">
                        <p className="w-8 text-lg font-bold text-zinc-500">
                        #{index + 1}
                        </p>

                        {user.image && (
                        <Image
                            src={user.image}
                            alt={user.name ?? "User avatar"}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        )}

                        <div>
                        <p className="font-semibold">
                            {user.name ?? "Unknown User"}
                        </p>
                        <p className="text-sm text-zinc-400">
                            {sort === "weekly_xp" ? (
                                <>
                                    {user.weeklyXp ?? 0} XP this week - Level {user.level} - {" "} {user.xp} total XP
                                </>
                            ) : (
                                <>
                                    Level {user.level} - {user.xp} XP - {user.streak} day streak - Best{" "}{user.highest_streak}
                                </>
                            )}
                        </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <ViewProfileButton userId={user.id} />
                        <FollowButton userId={user.id} />
                    </div>
                    </div>
                ))}
            </div>
        </section>
    );
}