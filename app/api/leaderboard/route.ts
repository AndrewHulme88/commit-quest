import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const sort = req.nextUrl.searchParams.get("sort") ?? "xp";

    const allowedSorts = ["xp", "level", "streak", "highest_streak"];

    const sortBy = allowedSorts.includes(sort as any)
        ? sort
        : "xp";

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