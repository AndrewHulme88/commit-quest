"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { signOut } from "next-auth/react"

export default function SettingsPage() {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            const response = await fetch("/api/settings");

            if (!response.ok) return;

            const data = await response.json();

            setName(data.name ?? "");
            setBio(data.bio ?? "");
            setIsPublic(data.isPublic ?? true);
        }

        loadSettings();
    }, []);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setSaving(true);
        setSaved(false);

        const response = await fetch("/api/settings", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                bio,
                isPublic,
            }),
        });

        if (response.ok) {
            setSaved(true);
        }

        setSaving(false);
    }

    async function handleDeleteAccount() {
        const confirmed = confirm(
            "Are you sure? This will permanently delete your account and all progress!"
        );

        if (!confirmed) return;

        const response = await fetch("/api/settings", {
            method: "DELETE",
        });

        if (response.ok) {
            await signOut({ callbackUrl: "/" });
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
            <Navbar />

            <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
                <h1 className="text-4xl font-bold">Settings</h1>
                <p className="mt-3 text-zinc-400">
                    Manage your profile and privacy preferences.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                    <section>
                        <h2 className="text-xl font-bold">Profile</h2>

                        <label className="mt-5 block">
                            <span className="text-sm text-zinc-400">Display name</span>
                            <textarea
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                maxLength={200}
                                rows={4}
                                placeholder="Tell people a little about yourself..."
                                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:-border-emerald-500"
                            />

                            <p className="mt-1 text-right text-xs text-zinc-500">
                                {bio.length}/200
                            </p>
                        </label>
                    </section>

                    <section className="border-t border-zinc-800 pt-6">
                        <h2 className="text-xl font-bold">Privacy</h2>

                        <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                            <div>
                                <p className="font-semibold">Public profile</p>
                                <p className="text-sm text-zinc-400">
                                    Show your profile in search, leaderboards, and public pages.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(event) => setIsPublic(event.target.checked)}
                                className="h-5 w-5"
                            />
                        </label>
                    </section>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </button>

                        {saved && <p className="text-sm text-emerald-400">Saved</p>}
                    </div>
                </form>

                <section className="border-t border-zinc-800 pt-6">
                    <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        Permanently delete your account, XP, streaks, achievements, followers, and actitvity.
                    </p>

                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500"
                    >
                        Delete Account
                    </button>
                </section>
            </main>

            <Footer />
        </div>
    )
}