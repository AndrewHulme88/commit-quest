"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FollowingList } from "@/components/FollowingList";
import { FollowersList } from "@/components/FollowersList";

export default function SocialPage() {
    return (
                <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
                    <main className="flex-1 bg-zinc-950 text-white">
                        <Navbar />
        
                        <section className="mx-auto max-w-5xl px-6 py-10">
                            <h1 className="text-4xl font-bold">Social</h1>
                            <p className="mt-3 text-zinc-400">
                                Social features are coming soon! Follow your friends and see how you stack up against other developers in the community. Stay tuned for updates!
                            </p>
                            <div className="mt-10">
                                <FollowingList />
                            </div>
                            <div className="mt-10">
                                <FollowersList />
                            </div>

                        </section>
        
                    </main>
        
                    <Footer />
                </div>
    )
}