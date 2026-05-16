"use client";

import { useState } from "react";

export function SyncActivityButton() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | {
        pushEvents: number;
        xp: number;
    }>(null);

    async function handleSync() {
        setLoading(true);

        const response = await fetch("/api/github/activity");
        const data = await response.json();

        setResult(data);
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

            {result && (
                <p>{result.pushEvents} push events found - {result.xp} XP earned Test</p>
            )}
        </div>
    );
}