import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q") ?? "";

    if (!query.trim()) {
        return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
            isPublic: true,
        },

        take: 10,
        select: {
            id: true,
            name: true,
            image: true,
            xp: true,
            level: true,
            streak: true,
        },
    });

    return NextResponse.json(users);
}