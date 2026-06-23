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

// Function to handle unlocking following and follower related achievements
async function checkFollowAchievements(currentUserId: string, followedUserId: string) {
    const unlockedAchievements = [];

    const followingCount = await prisma.follow.count({
        where: {
            followerId: currentUserId,
        },
    });

    const followerCount = await prisma.follow.count({
        where: {
            followingId: followedUserId,
        },
    });

    // Following achievements
    if (followingCount >= 1) {
        unlockedAchievements.push(
            await unlockAchievement(currentUserId, "first_follow")
        );
    }

    if (followingCount >= 5) {
        unlockedAchievements.push(
            await unlockAchievement(currentUserId, "following_5")
        );
    }

    if (followingCount >= 10) {
        unlockedAchievements.push(
            await unlockAchievement(currentUserId, "following_10")
        );
    }

    // Followers achievements
    if (followerCount >= 1) {
        unlockedAchievements.push(
            await unlockAchievement(currentUserId, "followers_1")
        );
    }

    if (followerCount >= 5) {
        unlockedAchievements.push(
            await unlockAchievement(currentUserId, "followers_5")
        );
    }

    if (followerCount >= 10) {
        unlockedAchievements.push(
            await unlockAchievement(currentUserId, "followers_10")
        );
    }

    return unlockedAchievements.filter(Boolean);
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

    const unlockedAchievements = await checkFollowAchievements(
        currentUser.id, 
        followingId
    );

    await createActivity({
        userId: currentUser.id,
        type: "follow",
        message: `${currentUser.name ?? "A developer"} followed another developer`,
    });

    return NextResponse.json({ 
        success: true,
        unlockedAchievements,
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
