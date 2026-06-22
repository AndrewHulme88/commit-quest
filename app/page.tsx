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
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <main className="flex-1 bg-zinc-950 text-white">
        <Navbar />

        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            Gamify your GitHub progress
          </span>

          <h2 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Turn your GitHub activity into XP, streaks, achievements, and friendly competition.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Commit Quest helps developers stay motivated by turning coding activity
            into RPG-style progression, social leaderboards, achievements, and profiles.
          </p>

          <button
            onClick={() => signIn("github")}
            className="mt-10 rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
          >
            Start your quest
          </button>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
          <FeatureCard
            title="Earn XP"
            description="Sync your GitHub push activity and earn XP as you build."
          />

          <FeatureCard
            title="Level Up"
            description="Progress through RPG-style levels that require more XP over time."
          />

          <FeatureCard
            title="Build Streaks"
            description="Stay consistent with daily coding streaks and personal bests."
          />

          <FeatureCard
            title="Unlock Achievements"
            description="Earn badges for milestones like XP goals, streaks, and social actions."
          />

          <FeatureCard
            title="Compete on Leaderboards"
            description="Compare all-time and weekly progress globally or against people you follow."
          />

          <FeatureCard
            title="Connect with Developers"
            description="Follow other users, view profiles, search developers, and track activity."
          />
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 text-center">
            <h3 className="text-3xl font-bold">
              Make consistency feel rewarding.
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Whether you're learning, building projects, or trying to stay accountable,
              Commit Quest gives your coding habit a sense of progress.
            </p>

            <button
              onClick={() => signIn("github")}
              className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-zinc-950 hover:bg-emerald-400"
            >
              Sign in with GitHub
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-2xl font-bold">{title}</p>
      <p className="mt-3 text-zinc-400">{description}</p>
    </div>
  );
}
