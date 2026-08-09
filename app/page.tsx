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
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-zinc-900">
      <main className="flex-1 bg-[#f7f8fa] text-zinc-900">
        <Navbar />

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-zinc-950 sm:text-6xl">
              Rewarding your
              <span className="block text-zinc-500">coding habits</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              Commit Quest helps developers stay motivated by turning coding activity
              into clear progress, shared milestones, and a little friendly competition.
            </p>

            <button
              onClick={() => signIn("github")}
              className="mt-9 rounded-md bg-zinc-900 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Continue with GitHub
            </button>
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-lg border border-zinc-200 bg-white px-7 py-6 text-zinc-950 shadow-xl shadow-zinc-200/50 sm:px-10 sm:py-8">
              <p className="text-5xl font-semibold tracking-[-0.05em]">+840 <span className="text-2xl text-zinc-400">XP</span></p>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full w-2/3 rounded-full bg-[#137a68]" /></div>
              <p className="mt-3 text-xs text-zinc-500">67% complete</p>
            <div className="mt-6 grid grid-cols-2 border-t border-zinc-200">
              <div className="border-r border-zinc-200 px-3 py-5"><p className="text-sm text-zinc-500">Active streak</p><p className="mt-2 text-2xl font-semibold">12 days</p></div>
              <div className="px-5 py-5"><p className="text-sm text-zinc-500">Level</p><p className="mt-2 text-2xl font-semibold">08</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl border-y border-zinc-200 px-6 py-16 md:grid-cols-3">
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

        </section>

        <section className="bg-zinc-900 px-6 py-20 text-center text-white">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-3xl font-semibold tracking-[-0.03em] text-4xl">
              Make consistency feel rewarding.
            </h3>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-lg text-zinc-400">
              Whether you're learning, building projects, or trying to stay accountable,
              Commit Quest gives your coding habit a sense of progress.
            </p>

            <button
              onClick={() => signIn("github")}
              className="mt-8 rounded-md bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-100"
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
    <div className="border-b border-zinc-200 py-6 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
      <p className="text-xl font-semibold">{title}</p>
      <p className="mt-3 text-zinc-500">{description}</p>
    </div>
  );
}
