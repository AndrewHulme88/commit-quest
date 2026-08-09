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
        <section className="text-white">
            <div className="flex items-end justify-between border-b border-zinc-700 pb-4">
                <div>
                    <h2 className="mt-1 text-2xl font-medium tracking-tight">Recent activity</h2>
                </div>
                <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-400">Live feed</span>
            </div>

            {loading && (
                <div className="space-y-1 py-2" aria-label="Loading activity">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="h-20 animate-pulse bg-zinc-800" />
                    ))}
                </div>
            )}

            {!loading && activities.length === 0 && (
                <div className="border-b border-zinc-700 py-12 text-center">
                    <p className="text-sm text-zinc-400">The feed is quiet for now.</p>
                </div>
            )}

            <div>
                {activities.slice(0, 6).map((activity, index) => (
                    <div 
                        key={activity.id}
                        className="group grid grid-cols-[2rem_2.5rem_1fr] items-center gap-3 border-b border-zinc-700 py-4 transition-colors hover:bg-zinc-800/60 sm:grid-cols-[2rem_2.5rem_1fr_auto] sm:px-2"
                    >
                        <span className="font-mono text-[10px] text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                        {activity.user.image && (
                            <Image
                                src={activity.user.image}
                                alt={activity.user.name ?? "User avatar"}
                                width={40}
                                height={40}
                                className="size-10 rounded-full border border-zinc-700"
                            />
                        )}

                        <div className={!activity.user.image ? "col-start-2 col-span-2" : ""}>
                            <p className="text-sm leading-5 text-zinc-200">{activity.message}</p>
                            <p className="mt-1 text-[11px] text-zinc-500 sm:hidden">
                                {new Date(activity.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <p className="hidden font-mono text-[10px] text-zinc-500 sm:block">
                            {new Date(activity.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase()}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
