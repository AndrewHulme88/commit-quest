import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET,});

    console.log("Token", token);

    if (!token?.githubAccessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token.githubAccessToken}`,
            Accept: "application/vnd.github+json",
        },
    });

    const githubUser = await userResponse.json();

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

    return NextResponse.json(events);
}