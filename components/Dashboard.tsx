"use client";

import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

type SyncResult = {
    pushEvents: number;
    newPushEvents: number;
    xp: number;
    totalXp: number;
    level: number;
    streak: number;
};

type UserStats = {
    totalXp: number;
    level: number;
    streak: number;
};

export function Dashboard() {
    const { data: session } = useSession();

    const [userStats, setUserStats] = useState<UserStats>({
        totalXp: 0,
        level: 1,
        streak: 0,
    });

    const [syncing, setSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<SyncResult | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            const statsResponse = await fetch("/api/user/stats");
            const savedStats = await statsResponse.json();
            
            setUserStats({
                totalXp: savedStats.totalXp,
                level: savedStats.level,
                streak: savedStats.streak,
            });

            setSyncing(true);

            const syncResponse = await fetch("/api/github/activity");
            const syncResult = await syncResponse.json();

            setUserStats({
                totalXp: syncResult.totalXp,
                level: syncResult.level,
                streak: syncResult.streak,
            });

            setSyncing(false);
            setLastSync(syncResult);
        }
        
        loadDashboard();
    }, []);

    if (!session?.user) return null;

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-bold">Commit Quest</h1>
        
                    <button
                    onClick={() => signOut()}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
                    >
                    Sign out
                    </button>
                </div>
            </nav>

            <div className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name ?? "User Avatar"}
                                width={72}
                                height={72}
                                className="rounded-full"
                            />
                        )}

                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome, {session.user.name}!
                            </h1>
                            <p className="text-zinc-400">Ready to earn some XP?</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Level</p>
                        <p className="text-4xl font-bold">{userStats.level}</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Total XP</p>
                        <p className="text-4xl font-bold">{userStats.totalXp}</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Streak</p>
                        <p className="text-4xl font-bold">{userStats.streak} Days</p>
                    </div>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    {syncing && <p className="text-sm text-zinc-400">Syncing with GitHub...</p>}
                    {lastSync && lastSync.xp > 0 && (
                        <p className="text-sm text-green-400">
                            +{lastSync.xp} XP from {lastSync.newPushEvents} new commits!
                        </p>
                    )}
                </section>

                <button
                    onClick={() => signOut()}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Sign Out
                </button>
            </div>
        </main>
    );
}