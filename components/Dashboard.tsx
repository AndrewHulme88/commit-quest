"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getXpForNextLevel } from "@/lib/xp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

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
    highest_streak: number;
};

export function Dashboard() {
    const { data: session } = useSession();

    const [userStats, setUserStats] = useState<UserStats>({
        totalXp: 0,
        level: 1,
        streak: 0,
        highest_streak: 0,
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
                highest_streak: savedStats.highest_streak,
            });

            setSyncing(true);

            const syncResponse = await fetch("/api/github/activity");
            const syncResult = await syncResponse.json();

            setUserStats({
                totalXp: syncResult.totalXp,
                level: syncResult.level,
                streak: syncResult.streak,
                highest_streak: syncResult.highest_streak,
            });

            setSyncing(false);
            setLastSync(syncResult);
        }
        
        loadDashboard();
    }, []);

    if (!session?.user) return null;

    const currentLevelStartXp = getXpForNextLevel(userStats.level - 1);
    const nextLevelXp = getXpForNextLevel(userStats.level);
    const currentLevelXp = userStats.totalXp - currentLevelStartXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelStartXp;
    const progressPercent = Math.min((currentLevelXp / xpNeededForNextLevel) * 100, 100);

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <div className="mx-auto max-w-6xl px-6 py-10">
                <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-xl">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-5">
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
                                <p className="mb-2 text-sm font-medium text-emerald-400">
                                    Developer Dashboard
                                </p>
                                <h2 className="text-3xl font-bold">
                                    Welcome, {session.user.name}!
                                </h2>
                                <p className="text-zinc-400">
                                    Track your progress
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-center">
                            <p className="text-sm text-emerald-300">Current Level</p>
                            <p className="text-5xl font-black text-emerald-400">{userStats.level}</p>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-center">
                            <p className="text-sm text-emerald-300">Highest Streak</p>
                            <p className="text-5xl font-black text-emerald-400">{userStats.highest_streak}</p>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Total XP</p>
                        <p className="mt-2 text-4xl font-bold">{userStats.totalXp}</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Current Streak</p>
                        <p className="mt-2 text-4xl font-bold">{userStats.streak} Days</p>
                        <p className="mt-2 text-sm text-zinc-500">
                            Keep your streak alive by committing every day!
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Sync Status</p>
                        <p className="mt-2 text-2xl font-bold">
                            {syncing ? "Checking..." : "Up to date"}
                        </p>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-semibold">Level Progress</p>
                        <p className="text-sm text-zinc-400">
                            {currentLevelXp} / {xpNeededForNextLevel} XP to next level
                        </p>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="text-xl font-bold">Latest Sync</h3>
                    {syncing && (<p className="text-sm text-zinc-400">Syncing with GitHub...</p>)}
                    {!syncing && lastSync && lastSync.xp > 0 && (
                        <p className="text-sm text-emerald-400">
                            +{lastSync.xp} XP from {lastSync.newPushEvents} new commits!
                        </p>
                    )}
                    {!syncing && lastSync && lastSync.xp === 0 && (
                        <p className="text-sm text-zinc-400">
                            No new commits since your last sync. Keep building to earn XP!
                        </p>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}