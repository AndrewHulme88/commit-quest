"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Dashboard } from "@/components/Dashboard";
import { stat } from "fs";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return <Dashboard />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <h1 className="mb-3 text-4xl font-bold">Commit Quest</h1>
        <p className="mb-6 text-zinc-400">Turn your GitHub activity into a quest!</p>
      </section>

      <button
        onClick={() => signIn("github")}
        className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
      >
        Sign in with GitHub
      </button>
    </main>
  );
}
