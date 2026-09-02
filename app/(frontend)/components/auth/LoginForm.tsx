"use client";

import toast from "react-hot-toast";
import { credentialsLogin } from "../../actions/auth.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "../../../schemas/auth.schema";

const LoginForm = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");

    const toastId = toast.loading("Logging in...");

    const error = await credentialsLogin(data.email, data.password);

    if (!error) {
      toast.success("Login success!", {
        id: toastId,
      });

      router.push("/dashboard");
    } else {
      toast.error(String(error), {
        id: toastId,
      });

      setErrorMessage(String(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card bg-base-100 w-full max-w-md shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">Login</h2>

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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-4">
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
