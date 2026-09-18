"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerUser } from "../../actions/auth.actions";
import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";
import { RegisterFormData, registerSchema } from "../../../schemas/auth.schema";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const RegisterForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    // console.log(data);

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await registerUser(
        data.name,
        data.email,
        data.password,
        data.confirmPassword,
      );

      // Field validation errors from server
      if (result.nameError || result.emailError || result.passwordError) {
        setErrorMessage(result.errorMessage ?? "");
        return;
      }

      if (result.errorMessage) {
        toast.error(result.errorMessage);
        return;
      }

      // Registration successful
      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);

      toast.error("Registration failed");
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };

  const searchParams = useSearchParams();
  const errorToastShown = useRef(false);

  useEffect(() => {
    const error = searchParams.get("error");

    if (errorToastShown.current) return;

    if (error === "AccountAlreadyExists") {
      toast.error("An account with this email already exists. Please login.");
      errorToastShown.current = true;
    }
  }, [searchParams]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card bg-base-100 w-full max-w-md shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">Create Account</h2>

        <FormInput
          label="Name"
          type="text"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...register("name")}
        />

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

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {errorMessage && (
          <div className="alert alert-error mt-2">
            <span>{errorMessage}</span>
          </div>
        )}

        <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
