"use client";

import { signIn, useSession } from "next-auth/react";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return <Dashboard />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Commit Quest</h1>

          <button
            onClick={() => signIn("github")}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Sign in
          </button>
        </div>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          Turn your GitHub activity into a quest!
        </span>

        <h2 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          Turn your GitHub commits into XP and level up as a developer.
        </h2>
      </section>
    </main>
  );
}
