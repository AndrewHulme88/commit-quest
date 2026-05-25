import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
            Built for developers who want progress to feel rewarding.
            &copy; {new Date().getFullYear()} Commit Quest. All rights reserved.
        </footer>
    )
}