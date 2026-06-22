import { prisma } from "./prisma";

export async function createActivity({
    userId,
    type,
    message,
}: {
    userId: string;
    type: string;
    message: string;
}) {
    return prisma.activity.create({
        data: {
            userId,
            type,
            message,
        },
    });
}