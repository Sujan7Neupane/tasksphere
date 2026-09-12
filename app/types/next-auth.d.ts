import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    platformRole: string;
    isActive: boolean;
  }
  interface Session {
    user: {
      id: string;
      platformRole: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    platformRole: string;
    isActive: boolean;
  }
}
