"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { credentialsLogin } from "../../actions/auth.actions";
import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";
import { LoginFormData, loginSchema } from "../../../schemas/auth.schema";
import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await credentialsLogin(data.email, data.password);

      if (result.emailError || result.passwordError) {
        setErrorMessage(result.errorMessage ?? "");
        return;
      }

      if (result.errorMessage) {
        toast.error(result.errorMessage);
        return;
      }

      if (result.success) {
        toast.success("Login successful!");
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Login failed");
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };

  const searchParams = useSearchParams();
  const errorToastShown = useRef(false);

  useEffect(() => {
    const error = searchParams.get("error");

    if (errorToastShown.current) return;

    if (error === "UserNotFound") {
      toast.error("User not found. Please register first.");
      errorToastShown.current = true;
    }

    if (error === "AccountDisabled") {
      toast.error("Your account has been disabled.");
      errorToastShown.current = true;
    }
  }, [searchParams]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card bg-base-100 w-full max-w-md shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">Login</h2>

        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        {errorMessage && (
          <div className="alert alert-error mt-2">
            <span>{errorMessage}</span>
          </div>
        )}

        <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <div className="divider">OR</div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="btn w-full rounded-sm bg-transparent"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </Button>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="link link-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
