"use client";

import { useEffect, useState } from "react";

type Props = {
    userId: string;
};

// This component displays a follow/unfollow button based on the current follow status between the logged-in user and the target user
export function FollowButton({ userId }: Props) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFollowStatus() {
            const response = await fetch(`/api/follow/status?userId=${userId}`);
            const data = await response.json();

            setIsFollowing(data.isFollowing);
            setLoading(false);
        }

        loadFollowStatus();
    }, [userId]);

    async function toggleFollow() {
        setLoading(true);

        await fetch(`/api/follow`, {
            method: isFollowing ? "DELETE" : "POST",
            body: JSON.stringify({ followingId: userId }),
        });

        setIsFollowing(!isFollowing);
        setLoading(false);
    }

    return (
        <button
            onClick={toggleFollow}
            disabled={loading}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
            >
                {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
    );
}