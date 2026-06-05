import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const githubId = token?.sub;
    const targetUserId = req.nextUrl.searchParams.get("userId");

    if (!githubId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!targetUserId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { githubId },
    });

    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUser.id,
                followingId: targetUserId,
            },
        },
    });

    return NextResponse.json({ 
        isFollowing: Boolean(follow)
    });
}