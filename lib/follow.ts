export function canFollowUser(currentUserId: string, targetUserId: string) {
    return currentUserId !== targetUserId;
}