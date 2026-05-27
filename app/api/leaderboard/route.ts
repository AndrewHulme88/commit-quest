import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: {
            xp: "desc",
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