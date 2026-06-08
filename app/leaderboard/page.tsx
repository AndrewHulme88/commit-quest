"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Leaderboard } from "@/components/Leaderboard"

export default function LeaderboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") return null;
    if (!session) return null;
    
    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
            <main className="flex-1 bg-zinc-950 text-white">
                <Navbar />

                <section className="mx-auto max-w-5xl px-6 py-10">
                    <h1 className="text-4xl font-bold">Leaderboards</h1>
                    <p className="mt-3 text-zinc-400">
                        See how you stack up against other developers!
                    </p>

                    <div className="mt-8">
                        <Leaderboard />
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}