"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FollowingList } from "@/components/FollowingList";
import { FollowersList } from "@/components/FollowersList";

type SocialTab = "following" | "followers";

export default function SocialPage() {
    const [activeTab, setActiveTab] = useState<SocialTab>("following");
    const { data: session, status } = useSession();
    const router = useRouter();

    // If the user is not authenticated, redirect to the home page
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") return null;
    if (!session) return null;

    return (
                <div className="min-h-screen flex flex-col bg-[#f7f8fa] text-zinc-900">
                    <main className="flex-1 bg-[#f7f8fa] text-zinc-900">
                        <Navbar />
        
                        <section className="mx-auto max-w-5xl px-6 py-10">
                            <h1 className="text-4xl font-bold">Social</h1>
                            <p className="mt-3 text-zinc-500">
                                Follow other developers to keep up with their progress.
                            </p>
                            
                            <div className="mt-8 inline-flex rounded-md bg-zinc-200/60 p-1">
                                <button
                                    onClick={() => setActiveTab("following")}
                                    className={`rounded-sm px-5 py-2 text-sm font-medium transition ${
                                        activeTab === "following"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-900"
                                    }`}
                                >
                                    Following
                                </button>

                                <button
                                    onClick={() => setActiveTab("followers")}
                                    className={`rounded-sm px-5 py-2 text-sm font-medium transition ${
                                        activeTab === "followers"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-900"
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
