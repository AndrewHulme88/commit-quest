import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// This route returns the list of users that the current user is following
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

    // Fetch the list of users that the current user is following
    const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        include: {
            following: {
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

    // Map the results to return only the followed users' information
    const followedUsers = following.map((f) => f.following);

    return NextResponse.json(followedUsers);
}