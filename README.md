# Commit Quest

Commit Quest is a gamified developer productivity platform that transforms GitHub activity into an RPG-inspired progression system. By connecting your GitHub account, you can earn XP, level up, maintain coding streaks, unlock achievements, and compete with other developers through leaderboards and social features.

## Features

* 🔐 **GitHub Authentication** – Secure sign in using GitHub OAuth.
* ⚡ **XP & Leveling System** – Earn XP from GitHub push events and progress through increasingly difficult levels.
* 🔥 **Daily Streaks** – Build and maintain coding streaks to stay consistent.
* 🏆 **Achievements** – Unlock badges by reaching milestones such as XP goals, streaks, and social interactions.
* 📊 **Personal Dashboard** – View your current level, XP, streaks, achievements, and progression.
* 🌍 **Leaderboards** – Compare your progress with other developers.
* 👥 **Social Features** – Follow other users and browse their public profiles.
* 🔍 **User Search** – Search for developers and discover new people to follow.
* 👤 **Profile Pages** – View user stats, achievements, and progression.

## Tech Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Authentication:** NextAuth.js with GitHub OAuth
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Deployment:** Vercel

## How It Works

1. Sign in with your GitHub account.
2. Commit Quest syncs your recent GitHub push activity.
3. New push events award XP and contribute towards your level progression.
4. Daily activity updates your coding streak.
5. Milestones unlock achievements that are permanently displayed on your profile.
6. Compare your progress on the leaderboard and interact with other developers through follows and profiles.

## Project Structure

```
app/
├── api/
│   ├── auth/
│   ├── github/
│   ├── leaderboard/
│   ├── profile/
│   ├── search/
│   └── social/
├── dashboard/
├── leaderboard/
├── profile/
├── search/
└── social/

components/
├── Dashboard
├── Leaderboard
├── Navbar
├── FollowButton
├── ViewProfileButton
└── ...

lib/
├── prisma
├── xp
└── achievements
```

## Local Development

Clone the repository:

```bash
git clone <repository-url>
cd commit-quest
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the required environment variables, including:

* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `NEXTAUTH_SECRET`
* `DATABASE_URL`

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

## Roadmap

Planned features include:

* Following-only leaderboards
* Developer activity feed
* Weekly and seasonal challenges
* Bonus XP events
* Additional achievements and progression systems
* Enhanced profile customization

## Motivation

Commit Quest was built to encourage consistent coding habits by combining developer productivity with game mechanics. Rather than simply tracking commits, the platform rewards progress, celebrates milestones, and introduces friendly competition through social features.

## License

This project is open source and available under the MIT License.
