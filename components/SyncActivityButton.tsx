"use client";

import { useState } from "react";

type SyncResult = {
    pushEvents: number;
    newPushEvents: number;
    xp: number;
    totalXp: number;
    level: number;
};

type Props = {
    onSyncComplete: (result: SyncResult) => void;
};

export function SyncActivityButton({ onSyncComplete }: Props) {
    const [loading, setLoading] = useState(false);

    async function handleSync() {
        setLoading(true);

        const response = await fetch("/api/github/activity");
        const data = await response.json();

        onSyncComplete(data);
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                onClick={handleSync}
                disabled={loading}
                className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Syncing..." : "Sync GitHub Activity"}
            </button>
        </div>
    );
}