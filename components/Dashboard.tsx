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
                    </div>
                </section>
            </div>
        </main>
    );
}