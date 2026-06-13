import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string}> }
) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            image: true,
            xp: true,
            level: true,
            streak: true,
            highest_streak: true,
            achievements: {
                include: {
                    achievement: true,
                },
            },
            _count: {
                select: {
                    followers: true,
                    following: true,
                },
            },
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        id: user.id,
        name: user.name,
        image: user.image,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        highest_streak: user.highest_streak,
        followers_count: user._count.followers,
        following_count: user._count.following,
        achievements: user.achievements.map((item) => item.achievement),
    });
}