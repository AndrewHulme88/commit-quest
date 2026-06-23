import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { githubId: token.sub }
    });

    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const follows = await prisma.follow.findMany({
        where: {
            followerId: currentUser.id,
        },
        select: {
            followingId: true,
        },
    });

    const visibleUserIds = follows.map((follow) => follow.followingId);

    if (visibleUserIds.length === 0) {
        return NextResponse.json([]);
    }

    const activities = await prisma.activity.findMany({
        where: {
            userId: {
                in: visibleUserIds,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    return NextResponse.json(activities);
}