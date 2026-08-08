import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white px-5 py-8 text-xs text-zinc-400 sm:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>&copy; {new Date().getFullYear()} Commit Quest</p>
                <Link href="https://www.moonfallsoftware.com/" className="transition hover:text-[#137a68]">
                    A Moonfall Software project ↗
                </Link>
            </div>
        </footer>
    )
}
