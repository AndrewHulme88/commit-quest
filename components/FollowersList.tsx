"use client";

import Image from "next/image";
import { FollowButton } from "./FollowButton";
import { useEffect, useState } from "react";

type FollowerUser = {
    id: string;
    name: string | null;
    image: string | null;
    xp: number;
    level: number;
    streak: number;
    highest_streak: number;
};

// This component displays the list of followers a user has
export function FollowersList() {
    const [followerUsers, setFollowerUsers] = useState<FollowerUser[]>([]);

    useEffect(() => {
        // Fetch the list of followers from the API
        async function loadFollowerUsers() {
            const response = await fetch("/api/social/followers");
            const data = await response.json();

            setFollowerUsers(data);
        }

        loadFollowerUsers();
    }, []);

    if (followerUsers.length === 0) {
        return (
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
                You have no followers yet. Encourage other developers to follow you!
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {followerUsers.map((followerUser) => (
                <div
                    key={followerUser.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                    <div className="flex items-center gap-4">
                        {followerUser.image && (
                            <Image
                                src={followerUser.image}
                                alt={followerUser.name ?? "User Avatar"}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        )}

                        <div>
                            <p className="font-semibold">{followerUser.name ?? "Unknown User"}</p>
                            <p className="text-sm text-zinc-400">
                                Level {followerUser.level} - {followerUser.xp} XP - {followerUser.streak} day streak
                            </p>
                        </div>
                    </div>

                    <FollowButton userId={followerUser.id} />
                </div>
            ))}
        </div>
    );
}