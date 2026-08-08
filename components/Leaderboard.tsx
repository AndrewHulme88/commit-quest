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
    const [sort, setSort] = useState<SortBy>("xp");
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
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-zinc-200 p-6 md:flex-row md:items-end md:justify-between">
                <div>
                <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
                <p className="mt-1 text-sm text-zinc-500">
                    Compare your progress with other developers.
                </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex rounded-full bg-zinc-100 p-1" aria-label="Leaderboard scope">
                        {scopeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setScope(option.value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${scope === option.value ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <label className="relative">
                        <span className="sr-only">Sort leaderboard</span>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value as SortBy)}
                            className="h-10 appearance-none rounded-full border border-zinc-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-zinc-700 outline-none transition hover:border-zinc-300 focus:border-zinc-400"
                        >
                            {sortOptions.map((option) => <option key={option.value} value={option.value}>Sort by {option.label}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">↓</span>
                    </label>
                </div>
            </div>

            {!loading && error && (
                <p className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>
            )}

            <div className="divide-y divide-zinc-100">
                {loading && (
                <p className="p-8 text-center text-sm text-zinc-500">Loading leaderboard...</p>
                )}

                {!loading && users.length === 0 && (
                <p className="p-8 text-center text-zinc-500">
                    {scope === "following"
                    ? "You are not following anyone yet."
                    : "No users found."}
                </p>
                )}

                {!loading &&
                users.map((user, index) => (
                    <div
                    key={user.id}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-zinc-50/70 sm:flex-row sm:items-center sm:justify-between"
                    >
                    <div className="flex items-center gap-4">
                        <p className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${index < 3 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                        {index + 1}
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
                        <p className="text-sm text-zinc-500">
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
