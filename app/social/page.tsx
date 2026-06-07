"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FollowingList } from "@/components/FollowingList";
import { FollowersList } from "@/components/FollowersList";

type SocialTab = "following" | "followers";

export default function SocialPage() {
    const [activeTab, setActiveTab] = useState<SocialTab>("following");

    return (
                <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
                    <main className="flex-1 bg-zinc-950 text-white">
                        <Navbar />
        
                        <section className="mx-auto max-w-5xl px-6 py-10">
                            <h1 className="text-4xl font-bold">Social</h1>
                            <p className="mt-3 text-zinc-400">
                                Follow other developers to keep up with their progress.
                            </p>
                            
                            <div className="mt-8 flex gap-2">
                                <button
                                    onClick={() => setActiveTab("following")}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                                        activeTab === "following"
                                            ? "bg-emerald-500 text-zinc-950"
                                            : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    }`}
                                >
                                    Following
                                </button>

                                <button
                                    onClick={() => setActiveTab("followers")}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                                        activeTab === "followers"
                                            ? "bg-emerald-500 text-zinc-950"
                                            : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    }`}
                                >
                                    Followers   
                                </button>
                            </div>

                            <div className="mt-8">
                                {activeTab === "following" ? <FollowingList /> : <FollowersList />}
                            </div>
                        </section>       
                    </main>
        
                    <Footer />
                </div>
    )
}