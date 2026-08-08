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
        <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-zinc-900">
            <Navbar />

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
                <h1 className="text-4xl font-bold">Search Developers</h1>
                <p className="mt-3 text-zinc-500">
                    Find other developers, view their profile, and follow their progress.
                </p>

                <form onSubmit={handleSearch} className="mt-8 flex gap-3">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by name..."
                        className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-[#96cabc] focus:ring-4 focus:ring-[#eef8f5]"
                    />

                    <button
                        type="submit"
                        className="rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-800"
                    >
                        Search
                    </button>
                </form>

                <section className="mt-8 space-y-4">
                    {loading && <p className="text-zinc-500">Searching...</p>}

                    {!loading && users.length === 0 && query && (
                        <p className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-500">
                            No users found.
                        </p>
                    )}

                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
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
                                    <p className="text-sm text-zinc-500">
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
