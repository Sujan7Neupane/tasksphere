"use server";
import axios from "axios";

import { signIn, signOut } from "@/auth";
import { CredentialsSignin } from "next-auth";
import {
  loginSchema,
  // registerApiSchema,
  registerSchema,
} from "../../schemas/auth.schema";

export type RegisterState = {
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  errorMessage?: string;
  success?: boolean;
};
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<RegisterState> => {
  const result = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      nameError: errors.name?.[0],
      emailError: errors.email?.[0],
      passwordError: errors.password?.[0],
      confirmPasswordError: errors.confirmPassword?.[0],
      errorMessage: "Please check the fields.",
    };
  }

  try {
    await axios.post(`${process.env.BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.log(error);

    return {
      errorMessage: error.response?.data?.message || "Registration failed.",
    };
  }
};

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}

export type LoginState = {
  emailError?: string;
  passwordError?: string;
  errorMessage?: string;
  success?: boolean;
};

export async function credentialsLogin(
  email: string,
  password: string,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email,
    password,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      emailError: errors.email?.[0],
      passwordError: errors.password?.[0],
      errorMessage: "Please fill all the fields.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    if (error instanceof CredentialsSignin) {
      return {
        errorMessage: "Invalid email or password.",
      };
    }

    return {
      errorMessage: "Login failed. Please try again.",
    };
  }
}
