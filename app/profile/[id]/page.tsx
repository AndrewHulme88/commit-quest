"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getXpForNextLevel } from "@/lib/xp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function UserProfilePage() {

    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
            <main className="flex-1 bg-zinc-950 text-white">
                <Navbar />

                <section className="mx-auto max-w-5xl px-6 py-10">
                    <h1 className="text-4xl font-bold">Profile Page</h1>
                    <p className="mt-3 text-zinc-400">
                        This is another user's profile page.
                    </p>
                </section>

            </main>

            <Footer />
        </div>
    )
}