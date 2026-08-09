import {
    Award,
    CalendarCheck,
    Flame,
    Gem,
    GitCommitHorizontal,
    Medal,
    Rocket,
    Sparkles,
    Target,
    Trophy,
    Users,
    Zap,
} from "lucide-react";

type AchievementIconProps = {
    name: string;
    className?: string;
};

export function AchievementIcon({ name, className = "size-5" }: AchievementIconProps) {
    const normalizedName = name.toLowerCase();
    const props = { className, strokeWidth: 1.7, "aria-hidden": true as const };

    if (normalizedName.includes("streak")) return <Flame {...props} />;
    if (normalizedName.includes("weekly") || normalizedName.includes("fortnight")) return <CalendarCheck {...props} />;
    if (normalizedName.includes("level 25") || normalizedName.includes("champion")) return <Trophy {...props} />;
    if (normalizedName.includes("level 10") || normalizedName.includes("master")) return <Medal {...props} />;
    if (normalizedName.includes("level")) return <Award {...props} />;
    if (normalizedName.includes("5000") || normalizedName.includes("hunter")) return <Gem {...props} />;
    if (normalizedName.includes("momentum")) return <Rocket {...props} />;
    if (normalizedName.includes("100")) return <Zap {...props} />;
    if (normalizedName.includes("follow") || normalizedName.includes("greeting")) return <Users {...props} />;
    if (normalizedName.includes("first")) return <GitCommitHorizontal {...props} />;
    if (normalizedName.includes("focus")) return <Target {...props} />;
    if (normalizedName.includes("xp")) return <Sparkles {...props} />;

    return <Award {...props} />;
}
