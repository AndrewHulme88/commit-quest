"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getXpForNextLevel } from "@/lib/xp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ActivityFeed } from "./ActivityFeed";
import { AchievementIcon } from "./AchievementIcon";

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
                            </div>
                            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                                Keep up the momentum <br></br><span className="text-zinc-500">{firstName}.</span>
                            </h1>
                        </div>
                    </div>

                    <section className="grid overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-[0_20px_60px_rgba(24,24,27,0.06)] lg:grid-cols-[1.35fr_0.65fr]" aria-label="Level overview">
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

                        <div className="flex min-h-56 items-center justify-center rounded-lg bg-zinc-100 p-8 text-zinc-950">
                            <div className="text-center">
                                <p className="text-2xl font-medium text-zinc-500">Current level</p>
                                <p className="mt-2 text-[7rem] font-semibold leading-none tracking-[-0.1em]">{userStats.level}</p>
                                <p className="mt-3 text-sm text-zinc-500">Next level at {nextLevelXp.toLocaleString()} XP</p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-8 grid border-y border-zinc-200 sm:grid-cols-3" aria-label="Developer statistics">
                        <Metric label="Total experience" value={userStats.totalXp.toLocaleString()} suffix="XP" />
                        <Metric label="Active streak" value={userStats.streak.toString()} suffix={userStats.streak === 1 ? "DAY" : "DAYS"} />
                        <Metric label="GitHub status" value={syncing ? "Syncing" : "Up to Date"} />
                    </section>

                    <div className="relative left-1/2 right-1/2 mt-16 -ml-[50vw] -mr-[50vw] w-screen bg-zinc-900 text-white">
                        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.35fr_0.65fr]">
                            <ActivityFeed />

                            <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-400">Personal best</p>
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

                            <section className="border-t border-zinc-700 pt-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-sm font-semibold">Latest sync</h2>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-zinc-400">
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
                        <div className="flex items-end justify-between pb-4">
                            <div>
                                <h2 className="mt-1 text-2xl font-medium tracking-tight">Achievements</h2>
                            </div>
                            <p className="font-mono text-xs text-zinc-400">{String(achievements.length).padStart(2, "0")} UNLOCKED</p>
                        </div>

                        <div className="mt-4 grid border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
                            {achievements.map((achievement) => (
                                <article key={achievement.id} className="group min-h-40 border-b border-zinc-200 p-5 transition-colors hover:bg-white/60 sm:border-r lg:[&:nth-child(3n)]:border-r-0">
                                    <div className="flex items-start justify-between">
                                        <span className="grid size-9 place-items-center border border-zinc-200 bg-white text-[#137a68]">
                                            <AchievementIcon name={achievement.name} />
                                        </span>
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

function Metric({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
    return (
        <div className="flex min-h-32 flex-col justify-between border-b border-zinc-200 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <p className="text-lg font-semibold text-zinc-500">{label}</p>
            <div className="mt-7 flex items-baseline gap-2">
                <p className={`${value.length > 7 ? "text-2xl" : "text-4xl"} font-medium tracking-[-0.05em]`}>{value}</p>
                {suffix && <span className="font-mono text-[12px] text-zinc-600">{suffix}</span>}
            </div>
        </div>
    );
}
