import Link from "next/link";

type Props = {
    userId: string;
};

export function ViewProfileButton({userId}: Props) {

    return (
        <Link href={`/profile/${userId}`} className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950">
            View profile
        </Link>
    );
}
