import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedSorts = ["xp", "weekly_xp", "level", "streak", "highest_streak"];
type SortBy = (typeof allowedSorts)[number];

// Function to get the current user
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

// Function to get the current week for the weekly leaderboard
function getStartOfWeek() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day;

    date.setDate(diff);
    date.setHours(0, 0, 0, 0);

    return date;
}

// This route returns the top 10 users sorted by the specified criteria (xp, level, streak, or highest_streak)
export async function GET(req: NextRequest) {
    const sort = req.nextUrl.searchParams.get("sort") ?? "xp";
    const scope = req.nextUrl.searchParams.get("scope") ?? "global";

    const sortBy: SortBy = allowedSorts.includes(sort as SortBy)
        ? (sort as SortBy)
        : "xp";

    // Weekly leaderboard logic
    if (sortBy === "weekly_xp") {
        const startOfWeek = getStartOfWeek();

        let userIdsFilter: string[] | undefined;

        if (scope === "following") {
            const currentUser = await getCurrentUser(req);

            if (!currentUser) {
                return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
            }

            const follows = await prisma.follow.findMany({
                where: { followerId: currentUser.id },
                select: { followingId: true },
            });

            userIdsFilter = [
                currentUser.id,
                ...follows.map((follow) => follow.followingId),
            ];
        }

        const weeklyScores = await prisma.githubEvent.groupBy({
            by: ["userId"],
            where: {
                createdAt: {
                    gte: startOfWeek,
                },
                ...(userIdsFilter
                    ? {
                        userId: {
                            in: userIdsFilter,
                        },
                    }
                : {}),
            },
            _sum: {
                xpAwarded: true,
            },
            orderBy: {
                _sum: {
                    xpAwarded: "desc",
                },
            },
            take: 10,
        });

        const userIds = weeklyScores.map((score) => score.userId);

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
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

        const usersWithWeeklyXp = weeklyScores.map((score) => {
            const user = users.find((user) => user.id === score.userId);

            return {
                ...user,
                weeklyXp: score._sum.xpAwarded ?? 0,
            };
        });

        return NextResponse.json(usersWithWeeklyXp);
    }

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