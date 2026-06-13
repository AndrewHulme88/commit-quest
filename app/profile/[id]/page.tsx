"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FollowButton } from "@/components/FollowButton";

type Achievement = {
    id: string;
    name: string;
    description: string;
    icon: string;
};

type Profile = {
    id: string;
    name: string | null;
    image: string | null;
    xp: number;
    level: number;
    streak: number;
    highest_streak: number;
    followers_count: number;
    following_count: number;
    achievements: Achievement[];
};

export default function ProfilePage() {
    const params = useParams();
    const id = params.id as string;

    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function LoadProfile() {
            const response = await fetch(`/api/profile/${id}`);
            const data = await response.json();

            setProfile(data);
        }

        LoadProfile();
    }, [id]);

    if(!profile) return null;

    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
            <Navbar />
            
            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
                <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-5">
                            {profile.image && (
                                <Image
                                    src={profile.image}
                                    alt={profile.name ?? "User avatar"}
                                    width={88}
                                    height={88}
                                    className="rounded-full"
                                />
                            )}

                            <div>
                                <p className="text-sm font-medium text-emerald-400">
                                    Developer Profile
                                </p>
                                <h1 className="mt-2 text-4xl font-bold">
                                    {profile.name ?? "Unknown User"}
                                </h1>
                                <p className="mt-2 text-zinc-400">
                                    Level {profile.level} - {profile.xp} XP
                                </p>
                            </div>
                        </div>

                        <FollowButton userId={profile.id} />
                    </div>
                </section>

                <section className="mt-6 grid gap-6 md:grid-cols-4">
                    <StatCard label="Level" value={profile.level} />
                    <StatCard label="Total XP" value={profile.xp} />
                    <StatCard label="Current Streak" value={`${profile.streak} days`} />
                    <StatCard label="Highest Streak" value={`${profile.highest_streak} days`} />
                </section>

                <section className="mt-6 grid gap-6 md:grid-cols-2">
                    <StatCard label="Followers" value={profile.followers_count} />
                    <StatCard label="Following" value={profile.following_count} />
                </section>

                <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-2xl font-bold">Achievements</h2>

                    {profile.achievements.length === 0 ? (
                        <p className="mt-4 text-zinc-400">
                            No achievements unlocked yet.
                        </p>
                    ) : (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {profile.achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-800 p-4"
                                >
                                    <p className="text-3xl">{achievement.icon}</p>
                                    <p className="mt-2 font-bold">{achievement.name}</p>
                                    <p className="text-sm text-zinc-400">{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            <Footer />
        </div>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}