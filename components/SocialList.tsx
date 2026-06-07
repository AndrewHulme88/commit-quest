"use client";

import { useState } from "react";
import Image from "next/image";
import { FollowButton } from "./FollowButton";

type FollowedUser = {
    id: string;
    name: string;
    image: string;
    xp: number;
    level: number;
    streak: number;
    highest_streak: number;
};

// This component displays the list of followed users with their stats and follow buttons
export function SocialList() {
    const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);

    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-2xl font-bold">Following</h2>

            <div className="space-y-4">
                {followedUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-700 p-4"
                    >
                        <div className="flex items-center gap-4">
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />

                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-zinc-400">
                                    Level {user.level} - {user.xp} XP
                                </p>
                            </div>
                        </div>

                        <FollowButton userId={user.id} />
                    </div>
                ))}
            </div>
        </section>
    );
}