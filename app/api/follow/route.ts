import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlockAchievement } from "@/lib/achievements";

// Helper function to get the current user
async function getCurrentUser(req: NextRequest) {
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const githubId = token?.sub;

    if (!githubId) {
        return null;
    }

    return prisma.user.findUnique({
        where: { githubId },
    });
}

// This function handles both following and unfollowing a user based on the HTTP method
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

    const unlockedAchievement = await unlockAchievement(
        currentUser.id, 
        "first_follow"
    );

    return NextResponse.json({ 
        success: true,
        unlockAchievements: unlockAchievement ? [unlockAchievement] : [],
    });
}

// Handle unfollowing a user
export async function DELETE(req: NextRequest) {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { followingId } = await req.json();

    await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId: currentUser.id,
                followingId,
            },
        },
    });

    return NextResponse.json({ success: true });
}
