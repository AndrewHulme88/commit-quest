import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// This route returns the list of users that are following the current user
export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const githubId = token?.sub;

    if (!githubId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { githubId },
    })

    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the list of users that are following the current user
    const followers = await prisma.follow.findMany({
        where: { followingId: currentUser.id },
        include: {
            follower: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    xp: true,
                    level: true,
                    streak: true,
                    highest_streak: true,
                }
            }
        }
    });

    // Map the results to return only the followers' information
    const followerUsers = followers.map((f) => f.follower);

    return NextResponse.json(followerUsers);
}