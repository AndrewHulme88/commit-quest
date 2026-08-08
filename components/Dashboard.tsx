"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getXpForNextLevel } from "@/lib/xp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ActivityFeed } from "./ActivityFeed";

type SyncResult = {
    skipped?: boolean;
    message?: string;
    pushEvents: number;
    newPushEvents: number;
    xp: number;
    totalXp: number;
    level: number;
    streak: number;
    highest_streak: number;
    unlockedAchievements: UnlockedAchievement[];
};

type UserStats = {
    totalXp: number;
    level: number;
    streak: number;
    highest_streak: number;
};

type Achievement = {
    id: string;
    name: string;
    description: string;
    icon: string;
};

type UnlockedAchievement = {
    id: string;
    achievement: {
        id: string;
        key: string;
        name: string;
        description: string;
        icon: string;
    };
};

function StatIcon({ type }: { type: "xp" | "streak" | "sync" }) {
    const paths = {
        xp: <path d="M12 3v18M5.5 7.5 12 3l6.5 4.5M5.5 16.5 12 21l6.5-4.5M4 12h16" />,
        streak: <path d="M13.5 2.5c.4 4-2.8 5.2-2.8 8.1 0 1.3.8 2.2 1.8 2.2 1.8 0 2.7-2.1 2.1-4 2.7 1.7 4.4 4 4.4 6.8A7 7 0 1 1 6.1 11.8c.2 2.5 1.6 3.6 2.8 3.7-1-5.7 1.8-8.2 4.6-13Z" />,
        sync: <path d="M20 7h-5V2M4 17h5v5M19 12a7 7 0 0 0-12-5l-2 2M5 12a7 7 0 0 0 12 5l2-2" />,
    };

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
            {paths[type]}
        </svg>
    );
}

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
    const [achievements, setAchievements] = useState<Achievement[]>([]);

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

            if (!syncResponse.ok) {
                console.error("Failed to sync with GitHub: ", await syncResponse.text());
                setSyncing(false);
                return;
            }

            const syncResult = await syncResponse.json();

            syncResult.unlockedAchievements?.forEach((unlock: UnlockedAchievement) => {
                toast.success(`Achievement Unlocked: ${unlock.achievement.name}`, {
                    description: unlock.achievement.description,
                });
            });

            const achievementsResponse = await fetch("/api/achievements");
            const achievementsData = await achievementsResponse.json();
            setAchievements(achievementsData);

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
    const currentLevelXp = Math.max(userStats.totalXp - currentLevelStartXp, 0);
    const xpNeededForNextLevel = Math.max(nextLevelXp - currentLevelStartXp, 1);
    const progressPercent = Math.min((currentLevelXp / xpNeededForNextLevel) * 100, 100);
    const firstName = session.user.name?.split(" ")[0] ?? "developer";

    return (
        <div className="min-h-screen bg-[#f7f8fa] text-zinc-900">
            <Navbar />

            <main className="relative overflow-hidden">
                <div className="dashboard-grid pointer-events-none absolute inset-0 opacity-35" />

                <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#137a68]">
                                <span className="size-1.5 rounded-full bg-[#137a68] " />
                                Your weekly progress
                            </div>
                            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                                Keep the momentum, <span className="text-zinc-400">{firstName}.</span>
                            </h1>
                        </div>
                        <p className="max-w-xs text-sm leading-6 text-zinc-500">
                            Your GitHub activity, distilled into a record of consistency and progress.
                        </p>
                    </div>

                    <section className="grid overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-2 shadow-[0_20px_60px_rgba(24,24,27,0.06)] lg:grid-cols-[1.35fr_0.65fr]" aria-label="Level overview">
                        <div className="relative p-6 sm:p-9">
                            <div className="flex items-center gap-4">
                                {session.user.image && (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name ?? "User avatar"}
                                        width={52}
                                        height={52}
                                        className="size-13 rounded-full border border-zinc-200"
                                    />
                                )}
                                <div>
                                    <p className="text-sm text-zinc-500">Current rank</p>
                                    <p className="mt-1 text-lg font-medium">Level {userStats.level} developer</p>
                                </div>
                            </div>

                            <div className="mt-12 sm:mt-16">
                                <div className="flex items-end justify-between gap-4">
                                    <p className="text-sm text-zinc-500">Progress to level {userStats.level + 1}</p>
                                    <p className="font-mono text-xs text-zinc-500">{currentLevelXp.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP</p>
                                </div>
                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100" role="progressbar" aria-label="Level progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPercent)}>
                                    <div className="relative h-full bg-[#137a68] transition-[width] duration-700 ease-out" style={{ width: `${progressPercent}%` }}>
                                        <span className="absolute -right-px -top-1 h-4 w-px bg-[#3f9b89]" />
                                    </div>
                                </div>
                                <p className="mt-3 text-right text-xs text-zinc-400">{Math.round(progressPercent)}% complete</p>
                            </div>
                        </div>

                        <div className="flex min-h-56 items-center justify-center rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-8 text-zinc-950">
                            <div className="text-center">
                                <p className="text-sm font-medium text-[#137a68]">Current level</p>
                                <p className="mt-2 text-[7rem] font-semibold leading-none tracking-[-0.1em]">{userStats.level}</p>
                                <p className="mt-3 text-xs text-zinc-500">Next level at {nextLevelXp.toLocaleString()} XP</p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-4 grid gap-4 sm:grid-cols-3" aria-label="Developer statistics">
                        <Metric label="Total experience" value={userStats.totalXp.toLocaleString()} suffix="XP" icon="xp" />
                        <Metric label="Active streak" value={userStats.streak.toString()} suffix={userStats.streak === 1 ? "DAY" : "DAYS"} icon="streak" />
                        <Metric label="GitHub status" value={syncing ? "SYNCING" : "CURRENT"} status={!syncing} icon="sync" />
                    </section>

                    <div className="relative left-1/2 right-1/2 mt-16 -ml-[50vw] -mr-[50vw] w-screen bg-zinc-900 text-white">
                        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.35fr_0.65fr]">
                            <ActivityFeed />

                            <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-300">Personal best</p>
                                        <h2 className="mt-1 text-xl font-medium tracking-tight">Longest streak</h2>
                                    </div>
                                    <p className="font-mono text-3xl tracking-[-0.08em]">{String(userStats.highest_streak).padStart(2, "0")}<span className="ml-2 text-xs tracking-normal text-zinc-500">DAYS</span></p>
                                </div>
                                <div className="py-5 text-sm leading-6 text-zinc-400">
                                    {userStats.streak >= userStats.highest_streak && userStats.streak > 0
                                        ? "You’re setting the pace right now. Today’s activity keeps your personal best moving."
                                        : `${Math.max(userStats.highest_streak - userStats.streak, 0)} more active days to match your record.`}
                                </div>
                            </section>

                            <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className={`size-2 rounded-full ${syncing ? "animate-pulse bg-amber-300" : "bg-[#137a68]"}`} />
                                    <h2 className="text-sm font-semibold">Latest sync</h2>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-zinc-500">
                                    {syncing && "Checking your latest GitHub activity…"}
                                    {!syncing && lastSync?.skipped && "Recently synced. Check back in a few minutes."}
                                    {!syncing && lastSync && !lastSync.skipped && lastSync.xp > 0 && `+${lastSync.xp} XP logged from ${lastSync.newPushEvents} new commits.`}
                                    {!syncing && lastSync && !lastSync.skipped && lastSync.xp === 0 && "No new commits since your last sync. Your next push is waiting."}
                                    {!syncing && !lastSync && "Your saved stats are available. GitHub sync could not be completed."}
                                </p>
                            </section>
                            </div>
                        </div>
                    </div>

                    <section className="mt-14">
                        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
                            <div>
                                <p className="text-xs font-semibold text-[#137a68]">Milestones</p>
                                <h2 className="mt-1 text-2xl font-medium tracking-tight">Achievement archive</h2>
                            </div>
                            <p className="font-mono text-xs text-zinc-400">{String(achievements.length).padStart(2, "0")} UNLOCKED</p>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {achievements.map((achievement, index) => (
                                <article key={achievement.id} className="group min-h-44 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                                    <div className="flex items-start justify-between">
                                        <span className="text-3xl ">{achievement.icon}</span>
                                        <span className="font-mono text-[10px] text-zinc-400">A—{String(index + 1).padStart(2, "0")}</span>
                                    </div>
                                    <h3 className="mt-7 font-medium">{achievement.name}</h3>
                                    <p className="mt-2 text-sm leading-5 text-zinc-500">{achievement.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}

function Metric({ label, value, suffix, icon, status }: { label: string; value: string; suffix?: string; icon: "xp" | "streak" | "sync"; status?: boolean }) {
    return (
        <div className="flex min-h-36 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</p>
                <StatIcon type={icon} />
            </div>
            <div className="mt-7 flex items-baseline gap-2">
                {status && <span className="size-2 rounded-full bg-[#137a68] " />}
                <p className={`${value.length > 7 ? "text-2xl" : "text-4xl"} font-medium tracking-[-0.05em]`}>{value}</p>
                {suffix && <span className="font-mono text-[10px] text-zinc-400">{suffix}</span>}
            </div>
        </div>
    );
}
