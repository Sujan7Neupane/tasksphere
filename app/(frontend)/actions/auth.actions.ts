"use server";
import axios from "axios";

import { signIn, signOut } from "@/auth";
import { CredentialsSignin } from "next-auth";

export async function credentialsLogin(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return null;
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return error.message;
    }

    throw error;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    await axios.post(`${process.env.BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
    });

    return null;
  } catch (error: any) {
    console.log(error);

    return error.response?.data?.message || "Registration failed.";
  }
};
