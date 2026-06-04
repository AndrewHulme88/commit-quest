import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const githubId = token?.sub;

    if (!githubId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { followingId } = await req.json();

    const currentUser = await prisma.user.findUnique({
        where: { githubId },
    });

    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.id === followingId) {
        return NextResponse.json(
            { error: "You cannot follow yourself" },
            { status: 400 }
        );
    }

    await prisma.follow.upsert({
        where: {
            followerId_followingId: {
                followerId: currentUser.id,
                followingId,
            },
        },
        update: {},
        create: {
            followerId: currentUser.id,
            followingId,
        },
    });

    return NextResponse.json({ success: true });
}