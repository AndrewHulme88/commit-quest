"use client";

import Image from "next/image";
import { FollowButton } from "./FollowButton";
import { useEffect, useState } from "react";
import { ViewProfileButton } from "./ViewProfileButton";

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
            <section className="border-t border-zinc-200 py-6">
                <h3 className="mb-3 text-xl font-bold">Following</h3>
                <p className="border-b border-zinc-200 py-8 text-zinc-500">
                    You are not following anyone yet. Follow other developers to see their progress and compete on the leaderboards!
                </p>
            </section>
        );
    }

    return (
            <section>
                <h3 className="mb-3 text-xl font-bold">Following</h3>
                <div className="border-t border-zinc-200">
                    {followedUsers.map((followedUser) => (
                        <div
                            key={followedUser.id}
                            className="flex flex-col gap-4 border-b border-zinc-200 py-5 sm:flex-row sm:items-center sm:justify-between"
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
                                <p className="text-sm text-zinc-500">
                                    Level {followedUser.level} - {followedUser.xp} XP - {followedUser.streak} day streak
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <ViewProfileButton userId={followedUser.id} />
                            <FollowButton userId={followedUser.id} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
