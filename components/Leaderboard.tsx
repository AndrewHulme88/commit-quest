"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type LeaderboardUser = {
    id: string;
    name: string;
    image: string;
    xp: number;
    level: number;
    streak: number;
    highest_streak: number;
};

export function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [sort, setSort] = useState("xp");

    useEffect(() => {
        async function loadLeaderboard() {
            const response = await fetch(`/api/leaderboard?sort=${sort}`);
            const data = await response.json();

            setUsers(data);
        }

        loadLeaderboard();
    }, [sort]);

    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-2xl font-bold">Leaderboard</h2>

            <div className="mb-6 flex flex-wrap gap-2">
                {[
                    { label: "XP", value: "xp" },
                    { label: "Level", value: "level" },
                    { label: "Current Streak", value: "streak" },
                    { label: "Highest Streak", value: "highest_streak" },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                            sort === option.value
                                ? "bg-emerald-500 text-zinc-950"
                                : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        }`}
                        >
                            {option.label}
                        </button>
                ))}
            </div>

            <div className="space-y-4">
                {users.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                    >
                        <div className="flex items-center gap-4">
                            <p className="w-6 text-lg font-bold text-zinc-500">#{index + 1}</p>
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />

                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-zinc-400">Level {user.level}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-emerald-400">{user.xp} XP</p>
                            <p className="text-sm text-zinc-500">Highest Streak: {user.highest_streak}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}