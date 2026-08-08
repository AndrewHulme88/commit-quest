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
        <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-zinc-900">
            <Navbar />

            <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
                <h1 className="text-4xl font-bold">Settings</h1>
                <p className="mt-3 text-zinc-500">
                    Manage your profile and privacy preferences.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                    <section>
                        <h2 className="text-xl font-bold">Profile</h2>

                        <label className="mt-5 block">
                            <span className="text-sm text-zinc-500">Display name</span>
                            <input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={80}
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-[#96cabc] focus:ring-4 focus:ring-[#eef8f5]"
                            />
                        </label>

                        <label className="mt-5 block">
                            <span className="text-sm text-zinc-500">Bio</span>
                            <textarea
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                maxLength={200}
                                rows={4}
                                placeholder="Tell people a little about yourself..."
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#96cabc] focus:ring-4 focus:ring-[#eef8f5]"
                            />

                            <p className="mt-1 text-right text-xs text-zinc-400">
                                {bio.length}/200
                            </p>
                        </label>
                    </section>

                    <section className="border-t border-zinc-200 pt-6">
                        <h2 className="text-xl font-bold">Privacy</h2>

                        <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-[#f7f8fa] p-4">
                            <div>
                                <p className="font-semibold">Public profile</p>
                                <p className="text-sm text-zinc-500">
                                    Show your profile in search, leaderboards, and public pages.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(event) => setIsPublic(event.target.checked)}
                                className="peer sr-only"
                            />
                            <span className="relative h-7 w-12 shrink-0 rounded-full bg-zinc-300 transition peer-checked:bg-[#137a68] peer-focus-visible:ring-4 peer-focus-visible:ring-[#eef8f5] after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true" />
                        </label>
                    </section>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </button>

                        {saved && <p className="text-sm text-[#137a68]">Saved</p>}
                    </div>
                </form>

                <section className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>

                    <p className="mt-2 text-sm text-zinc-500">
                        Permanently delete your account, XP, streaks, achievements, followers, and activity.
                    </p>

                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="mt-4 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Delete Account
                    </button>
                </section>
            </main>

            <Footer />
        </div>
    )
}
