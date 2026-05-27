"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Leaderboard } from "@/components/Leaderboard"

export default function LeaderboardPage() {
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