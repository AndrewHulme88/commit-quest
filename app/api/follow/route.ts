import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlockAchievement } from "@/lib/achievements";
import { canFollowUser } from "@/lib/follow";
import { createActivity } from "@/lib/activity";

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

    if (!canFollowUser(currentUser.id, followingId)) {
        return NextResponse.json(
            { error: "You cannot follow yourself" },
            { status: 400 }
        );
    }

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUser.id,
                followingId,
            },
        },
    });

    if (existingFollow) {
        return NextResponse.json({
            success: true,
            alreadyFollowing: true,
            unlockedAchievements: [],
        });
    }

    await prisma.follow.create({
        data: {
            followerId: currentUser.id,
            followingId,
        },
    });

    const unlockedAchievement = await unlockAchievement(
        currentUser.id, 
        "first_follow"
    );

    await createActivity({
        userId: currentUser.id,
        type: "follow",
        message: `${currentUser.name ?? "A developer"} followed another developer`,
    });

    return NextResponse.json({ 
        success: true,
        unlockedAchievements: unlockedAchievement ? [unlockedAchievement] : [],
    });
}

// Handle unfollowing a user
export async function DELETE(req: NextRequest) {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { followingId } = await req.json();

    await prisma.follow.deleteMany({
        where: {
                followerId: currentUser.id,
                followingId,
        },
    });

    return NextResponse.json({ success: true });
}
