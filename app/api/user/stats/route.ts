import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const githubId = token?.sub;

    if (!githubId) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401}
        );
    }

    const user = await prisma.user.findUnique({
        where: { githubId },
    });

    return NextResponse.json({
        totalXp: user?.xp ?? 0,
        level: user?.level ?? 1,
        streak: user?.streak ?? 0,
    });
}