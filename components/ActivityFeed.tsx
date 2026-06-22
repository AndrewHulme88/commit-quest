"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Activity = {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

export function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadActivities() {
            const response = await fetch("/api/activity-feed");

            if (!response.ok) {
                setLoading(false);
                return;
            }

            const data = await response.json();
            setActivities(data);
            setLoading(false);
        }

        loadActivities();
    }, []);

    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>

            {loading && (
                <p className="mt-4 text-sm text-zinc-400">Loading activity...</p>
            )}

            {!loading && activities.length === 0 && (
                <p className="mt-4 text-sm text-zinc-400">
                    No recent activity
                </p>
            )}

            <div className="mt-4 space-y-4">
                {activities.map((activity) => (
                    <div 
                        key={activity.id}
                        className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-800 p-4"
                    >
                        {activity.user.image && (
                            <Image
                                src={activity.user.image}
                                alt={activity.user.name ?? "User avatar"}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        )}

                        <div>
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-zinc-500">
                                {new Date(activity.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}