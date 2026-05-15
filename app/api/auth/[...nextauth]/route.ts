import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.githubAccessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.githubAccessToken = token.githubAccessToken;
      return session;
    },

    async signIn({ user, account }) {
      if (!account?.providerAccountId) return false;

      await prisma.user.upsert({
        where: {
          githubId: account.providerAccountId,
        },
        update: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
        create: {
          githubId: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      });

      return true;
    },
  },
});

export { handler as GET, handler as POST };