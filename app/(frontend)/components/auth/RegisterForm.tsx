"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../../schemas/auth.schema";
import { registerUser } from "../../actions/auth.actions";

const RegisterForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage("");

    const toastId = toast.loading("Creating account...");

    const error = await registerUser(data.name, data.email, data.password);

    if (!error) {
      toast.success("Account created successfully!", {
        id: toastId,
      });

      router.push("/login");
    } else {
      const message = String(error);

      toast.error(message, {
        id: toastId,
      });

      setErrorMessage(message);
    }
    toast.dismiss(toastId);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card bg-base-100 w-full max-w-md shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">Create Account</h2>

        <div className="form-control">
          <label className="label mb-1 mr-3">
            <span className="label-text">Name</span>
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            className="input input-bordered w-full rounded-md"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label mb-1 mr-3">
            <span className="label-text">Email</span>
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full rounded-md"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label mb-1 mr-3">
            <span className="label-text">Password</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full pr-12 rounded-md"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label mb-1 mr-3">
            <span className="label-text">Confirm Password</span>
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="input input-bordered w-full pr-12 rounded-md"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-error text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="alert alert-error mt-2">
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-4 rounded-md"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>

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
