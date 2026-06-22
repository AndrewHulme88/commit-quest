import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

async function getCurrentUser(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) return null;

    return prisma.user.findUnique ({
        where: { githubId: token.sub },
    });
}

export async function GET(req: NextRequest) {
    const user = await getCurrentUser(req);

    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
        name: user.name,
        bio: user.bio,
        isPublic: user.isPublic,
    });
}

export async function PATCH(req: NextRequest) {
    const user = await getCurrentUser(req);

    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, bio, isPublic } = await req.json();

    if (bio && bio.length > 200) {
        return NextResponse.json(
            { error: "Bio must be 200 characters or less"},
            { status: 400 }
        );
    }
    
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            name,
            bio,
            isPublic,
        },
        select: {
            name: true,
            bio: true,
            isPublic: true,
        },
    });

    return NextResponse.json(updatedUser);
}