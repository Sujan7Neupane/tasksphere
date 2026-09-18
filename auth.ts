import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma/client";
import bcrypt from "bcrypt";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      //   credentials = email and password - come from form
      async authorize(credentials) {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) throw new CredentialsSignin("User not found.");

        if (!user.password) {
          throw new CredentialsSignin("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid email or password.");
        }

        if (!user.isActive) {
          throw new CredentialsSignin(
            "Account has been disabled. Please contact an administrator.",
          );
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          platformRole: user.platformRole,
          isActive: user.isActive,
        };
      },
    }),
  ],
  // to add id and platform role in token
  // generally nextjs ma token ma name and email matra huncha
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("GOOGLE EMAIL:", user.email);

        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });
        console.log("DB USER:", dbUser);

        if (!dbUser) {
          return "/login?error=UserNotFound";
        }

        if (!dbUser.isActive) {
          return "/login?error=AccountDisabled";
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: {
              email: user.email!,
            },
          });

          if (dbUser) {
            token.id = dbUser.id.toString();
            token.platformRole = dbUser.platformRole;
            token.isActive = dbUser.isActive;
          }
        } else {
          token.id = user.id;
          token.platformRole = user.platformRole;
          token.isActive = user.isActive;
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.platformRole = token.platformRole;
      session.user.isActive = token.isActive;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
