"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { SyncActivityButton } from "./SyncActivityButton";

export function Dashboard() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name ?? "User Avatar"}
                                width={72}
                                height={72}
                                className="rounded-full"
                            />
                        )}

                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome, {session.user.name}!
                            </h1>
                            <p className="text-zinc-400">Ready to earn some XP?</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Level</p>
                        <p className="text-4xl font-bold">1</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Total XP</p>
                        <p className="text-4xl font-bold">0</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">Streak</p>
                        <p className="text-4xl font-bold">0 Days</p>
                    </div>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="mb-4 text-xl font-semibold">Sync Your GitHub Activity</h2>
                    <SyncActivityButton />
                </section>

                <button
                    onClick={() => signOut()}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Sign Out
                </button>
            </div>
        </main>
    );
}