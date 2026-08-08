import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FeedbackLink } from "./FeedbackLink";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 text-zinc-900 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <Link href="/" className="flex items-center gap-3" aria-label="Commit Quest home">
                    <span className="text-base font-semibold tracking-[-0.02em]">Commit Quest</span>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    {session?.user? (
                        <Link
                            href="/"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            Home
                        </Link>
                    )}

                    {session?.user? (
                        <Link
                            href="/social"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            Social
                        </Link>
                    ) : (
                        null
                    )}

                    {session?.user? (
                        <Link
                            href="/leaderboard"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            Leaderboard
                        </Link>
                    ) : (
                        null
                    )}

                    {session?.user? (
                        <Link
                            href="/search"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            Search
                        </Link>
                    ) : (
                        null
                    )}

                    {session?.user? (
                        <Link
                            href="/settings"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            Settings
                        </Link>
                    ) : (
                        null
                    )}

                    {session?.user? (
                        <FeedbackLink />
                    ) : (
                        null
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {session?.user?.image && (
                        <Image
                            src={session.user.image}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="rounded-full border border-zinc-200"
                        />
                    )}

                    {session?.user ? (
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
                            >
                            Sign out
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn("github")}
                            className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800"
                            >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
            {session?.user && (
                <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto border-t border-zinc-100 px-5 py-2 lg:hidden">
                    {[["Dashboard", "/"], ["Social", "/social"], ["Leaderboard", "/leaderboard"], ["Search", "/search"], ["Settings", "/settings"]].map(([label, href]) => (
                        <Link key={href} href={href} className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    )
}
