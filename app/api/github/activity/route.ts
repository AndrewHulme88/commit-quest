import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateLevel }  from "@/lib/xp";
import { checkSyncAchievements } from "@/lib/achievements";
import { calculateStreak } from "@/lib/streak";
import { createActivity } from "@/lib/activity";

// This route fetches the authenticated user's GitHub activity using their access token
export async function GET(req: NextRequest) {
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET,});

    if (!token?.githubAccessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const githubId = token.sub;

    if (!githubId) {
        return NextResponse.json({ error: "Missing GitHub ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { githubId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Caching to limit syncing to 5 minute cooldown
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (user.lastSync && user.lastSync > fiveMinutesAgo) {
        return NextResponse.json({
            skipped: true,
            message: "Recently synced",
            pushEvents: 0,
            newPushEvents: 0,
            xp: 0,
            totalXp: user.xp,
            level: user.level,
            streak: user.streak,
            highest_streak: user.highest_streak,
            unlockedAchievements: [],
        });
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

    // Check if the GitHub API request was successful and if the response is an array
    if (!eventsResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch GitHub activity" }, { status: eventsResponse.status });
    }

    if (!Array.isArray(events)) {
        return NextResponse.json({ error: "GitHub response was not an array" }, { status: 500 });
    }

    // Filter for push events
    const pushEvents = events.filter(
        (event: any) => event.type === "PushEvent"
    );

    // Calculate XP and level based on the number of push events
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

    // Calculate the user's current streak
    const { streak, highest_streak } = calculateStreak({
        currentStreak: user.streak,
        highestStreak: user.highest_streak ?? 0,
        lastActivityDate: user.lastActivityDate,
        hasNewActivity: newPushEvents.length > 0,
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
    const level = calculateLevel(updatedUser.xp);

    // Update the user's level in the database
    const finalUser = await prisma.user.update({
        where: {
            githubId,
        },
        data: {
            level,
            streak,
            highest_streak,
            lastActivityDate: newPushEvents.length > 0 ? new Date() : user.lastActivityDate,
            lastSync: new Date(),
        },
    });

    // Create activity showing that this user earned XP. This will then be shown in the activity feed
    if (xp > 0) {
        await createActivity({
            userId: finalUser.id,
            type: "xp_earned",
            message: `${finalUser.name ?? "A developer"} earned ${xp} XP`,
        });
    }

    const unlockedAchievements = await checkSyncAchievements({
        id: finalUser.id,
        xp: finalUser.xp,
        level: finalUser.level,
        streak: finalUser.streak,
    });

    return NextResponse.json({
        pushEvents: pushEvents.length,
        newPushEvents: newPushEvents.length,
        xp,
        totalXp: updatedUser.xp,
        level: finalUser.level,
        streak: finalUser.streak,
        highest_streak: finalUser.highest_streak,
        unlockedAchievements,
    });
}