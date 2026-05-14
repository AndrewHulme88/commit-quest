"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to GitHub Login</h2>
        {session ? (
          <div className="text-center">
            <p className="mb-4">Signed in as {session.user?.name}</p>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">You are not signed in</p>
            <button
              onClick={() => signIn("github")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign In with GitHub
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
