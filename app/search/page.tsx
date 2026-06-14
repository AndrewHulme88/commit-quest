"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FollowButton } from "@/components/FollowButton";
import { ViewProfileButton } from "@/components/ViewProfileButton";

type SearchUser = {
    id: string;
    name: string | null;
    image: string | null;
    xp: null;
    level: null;
    streak: null;
};

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleSearch(event: React.FormEvent) {
        event.preventDefault();

        if (!query.trim()) {
            setUsers([]);
            return;
        }

        setLoading(true);

        const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        setUsers(data);
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
            <Navbar />

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
                <h1 className="text-4xl font-bold">Search Developers</h1>
                <p className="mt-3 text-zinc-400">
                    Find other developers, view their profile, and follow their progress.
                </p>

                <form onSubmit={handleSearch} className="mt-8 flex gap-3">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by name..."
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500"
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
                    >
                        Search
                    </button>
                </form>

                <section className="mt-8 space-y-4">
                    {loading && <p className="text-zinc-400">Searching...</p>}

                    {!loading && users.length === 0 && query && (
                        <p className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
                            No users found.
                        </p>
                    )}

                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:flex-row sm:items-center sm:fustify-between"
                        >
                            <div className="flex items-center gap-4">
                                {user.image && (
                                    <Image
                                        src={user.image}
                                        alt={user.name ?? "User Avatar"}
                                        width={52}
                                        height={52}
                                        className="rounded-full"
                                    />
                                )}

                                <div>
                                    <p className="font-semibold">{user.name ?? "Unknown User"}</p>
                                    <p className="text-sm text-zinc-400">
                                        Level {user.level} - {user.xp} XP - {user.streak} day streak
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <ViewProfileButton userId={user.id} />
                                <FollowButton userId={user.id} />
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    )
}