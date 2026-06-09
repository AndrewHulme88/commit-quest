import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { githubId: token.sub },
        include: {
            achievements: {
                include: {
                    achievement: true,
                },
            },
        },
    });

    return NextResponse.json(
        user?.achievements.map((item) => item.achievement) ?? []
    );
}