import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/">
                    <h1 className="text-xl font-bold">Commit Quest</h1>
                </Link>

                <div className="flex items-center gap-4">
                    {session?.user? (
                        <Link
                            href="/"
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
                        >
                            Home
                        </Link>
                    )}

                    <Link
                        href="/social"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
                    >
                        Social
                    </Link>

                    <Link
                        href="/leaderboard"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
                    >
                        Leaderboard
                    </Link>
                </div>

                <div className="flex items-center gap-5">
                    {session?.user?.image && (
                        <Image
                            src={session.user.image}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    )}

                    {session?.user ? (
                        <button
                            onClick={() => signOut()}
                            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
                            >
                            Sign out
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn("github")}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
                            >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}