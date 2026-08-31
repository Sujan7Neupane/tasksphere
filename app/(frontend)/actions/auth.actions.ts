"use server";

import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

export async function credentialsLogin(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return null;
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return error.message;
    }

    throw error;
  }
}
