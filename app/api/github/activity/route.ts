import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

    const pushEvents = events.filter(
        (event: any) => event.type === "PushEvent"
    );

    // const commitCounter = pushEvents.reduce(
    //     (total: number, event: any) => {
    //         const commits = event.payload?.commits ?? [];
    //         return total + commits.length;
    //     },
    //     0
    // );

    const xp = pushEvents.length * 10;

    console.log(pushEvents[0]);

    return NextResponse.json({
        //commits: commitCounter,
        xp,
        pushEvents: pushEvents.length,
    });
}