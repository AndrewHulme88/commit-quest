import Link from "next/link";

type Props = {
    userId: string;
};

export function ViewProfileButton({userId}: Props) {

    return (
        <Link href={`/profile/${userId}`} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
            View Profile
        </Link>
    );
}