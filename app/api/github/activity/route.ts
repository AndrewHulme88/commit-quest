import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This route fetches the authenticated user's GitHub activity using their access token
export async function GET(req: NextRequest) {
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET,});

    if (!token?.githubAccessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch the authenticated user's GitHub profile
    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token.githubAccessToken}`,
            Accept: "application/vnd.github+json",
        },
    });

    // Convert the response to JSON
    const githubUser = await userResponse.json();

    // Fetch the authenticated user's GitHub activity (events)
    const eventsResponse = await fetch(
        `https://api.github.com/users/${githubUser.login}/events`,
        {
            headers: {
                Authorization: `Bearer ${token.githubAccessToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    const events = await eventsResponse.json();

    // Filter for push events
    const pushEvents = events.filter(
        (event: any) => event.type === "PushEvent"
    );

    // Calculate XP and level based on the number of push events
    const pushEventCount = pushEvents.length;

    const githubId = token.sub;

    const user = await prisma.user.findUnique({
        where: { githubId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPushEvents = [];

    for (const event of pushEvents) {
        const existingEvent = await prisma.githubEvent.findUnique({
            where: { id: event.id },
        });

        if (!existingEvent) {
            newPushEvents.push(event);
        }
    }

    const xp = newPushEvents.length * 10;

    await prisma.githubEvent.createMany({
        data: newPushEvents.map((event: any) => ({
            id: event.id,
            userId: user.id,
            type: event.type,
            xpAwarded: 10,
        })),
    });

    // Update the user's XP and last sync time in the database
    const updatedUser = await prisma.user.update({
        where: { githubId},
        data: {
            xp: {
                increment: xp,
            },
            lastSync: new Date(),
        },
    });

    // Calculate the user's level based on their total XP
    const level = Math.floor(updatedUser.xp / 100) + 1;

    // Update the user's level in the database
    const finalUser = await prisma.user.update({
        where: {
            githubId,
        },
        data: {
            level,
        },
    });

    return NextResponse.json({
        pushEvents: pushEvents.length,
        newPushEvents: newPushEvents.length,
        xp,
        totalXp: updatedUser.xp,
        level: finalUser.level,
    });
}