import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      session.user.username = token.username;
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findUnique({
        where: {
          email: user?.email ?? undefined,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }
      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return "/";
    },
  },
});

export { handler as GET, handler as POST };
