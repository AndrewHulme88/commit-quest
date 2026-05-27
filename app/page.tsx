"use client";

import { signIn, useSession } from "next-auth/react";
import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <main className="min-h-screen flex-1 bg-zinc-950 text-white">
        <Navbar />

        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            Turn your GitHub activity into a quest!
          </span>

          <h2 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Turn your GitHub commits into XP and level up as a developer.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Commit Quest rewards your GitHub activity with game-like progression, 
            helping you stay motivated while you build.
          </p>

          <button
            onClick={() => signIn("github")}
            className="mt-10 rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 shadow-lg shados-emerald-500/20 hover:bg-emerald-400"
            >
              Start your quest
            </button>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
          <div className="rounded-2-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-3xl font-bold">XP</p>
            <p className="mt-3 text-zinc-400">Earn experience points for your GitHub commits</p>
          </div>

          <div className="rounded-2-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-3xl font-bold">Levels</p>
            <p className="mt-3 text-zinc-400">Watch your developer profile grow as you build and level up</p>
          </div>

          <div className="rounded-2-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-3xl font-bold">Streaks</p>
            <p className="mt-3 text-zinc-400">Stay motivated with daily commit streaks</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
