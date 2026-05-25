import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Commit Quest. All rights reserved.
            <br />
            <Link href="https://www.moonfallsoftware.com/" className="text-emerald-500 hover:underline">
                Moonfall Software
            </Link>
        </footer>
    )
}