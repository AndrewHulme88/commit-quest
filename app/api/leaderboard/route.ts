import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedSorts = ["xp", "level", "streak", "highest_streak"];
type SortBy = (typeof allowedSorts)[number];

async function getCurrentUser(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const githubId = token?.sub;

    if (!githubId) return null;

    return prisma.user.findUnique({
        where: { githubId },
    });
}

// This route returns the top 10 users sorted by the specified criteria (xp, level, streak, or highest_streak)
export async function GET(req: NextRequest) {
    const sort = req.nextUrl.searchParams.get("sort") ?? "xp";
    const scope = req.nextUrl.searchParams.get("scope") ?? "global";

    const sortBy: SortBy = allowedSorts.includes(sort as SortBy)
        ? (sort as SortBy)
        : "xp";

    if (scope === "following") {
        const currentUser = await getCurrentUser(req);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const follows = await prisma.follow.findMany({
            where: {
                followerId: currentUser.id,
            },
            select: {
                followingId: true,
            },
        });

        const followingIds = [
            currentUser.id,
            ...follows.map((follow) => follow.followingId),
        ];

        if (followingIds.length === 0) {
            return NextResponse.json([]);
        }

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: followingIds,
                },
            },
            orderBy: {
                [sortBy]: "desc",
            },
            take: 10,
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
                level: true,
                streak: true,
                highest_streak: true,
            },
        });

        return NextResponse.json(users);
    }

    const users = await prisma.user.findMany({
        orderBy: {
            [sortBy]: "desc",
        },
        take: 10,
        select: {
            id: true,
            name: true,
            image: true,
            xp: true,
            level: true,
            streak: true,
            highest_streak: true,
        },
    });

    return NextResponse.json(users);
}