"use client";

import Image from "next/image";
import { FollowButton } from "./FollowButton";
import { useEffect, useState } from "react";

type FollowedUser = {
    id: string;
    name: string | null;
    image: string | null;
    xp: number;
    level: number;
    streak: number;
    highest_streak: number;
};

// This component displays the list of followed users
export function FollowingList() {
    const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);

    useEffect(() => {
        // Fetch the list of followed users from the API
        async function loadFollowedUsers() {
            const response = await fetch("/api/social/following");
            const data = await response.json();

            setFollowedUsers(data);
        }

        loadFollowedUsers();
    }, []);

    if (followedUsers.length === 0) {
        return (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-3 text-xl font-bold">Following</h3>
                <p className="rounded-2xl border border-zinc-800 bg-zinc-800 p-6 text-zinc-400">
                    You are not following anyone yet. Follow other developers to see their progress and compete on the leaderboards!
                </p>
            </section>
        );
    }

    return (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-3 text-xl font-bold">Following</h3>
                <div className="space-y-4">
                    {followedUsers.map((followedUser) => (
                        <div
                            key={followedUser.id}
                            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-800 p-5"
                        >
                        <div className="flex items-center gap-4">
                            {followedUser.image && (
                                <Image
                                    src={followedUser.image}
                                    alt={followedUser.name ?? "User Avatar"}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                            )}

                            <div>
                                <p className="font-semibold">{followedUser.name ?? "Unknown User"}</p>
                                <p className="text-sm text-zinc-400">
                                    Level {followedUser.level} - {followedUser.xp} XP - {followedUser.streak} day streak
                                </p>
                            </div>
                        </div>

                        <FollowButton userId={followedUser.id} />
                    </div>
                ))}
            </div>
        </section>
    );
}