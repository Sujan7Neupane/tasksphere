import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma/client";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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

        if (!user) throw new CredentialsSignin("Invalid email or password.");

        if (!user.password) {
          throw new CredentialsSignin("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid email or password.");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          platformRole: user.platformRole,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
