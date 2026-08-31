"use client";

import toast from "react-hot-toast";
import { credentialsLogin } from "../../actions/auth.actions";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  return (
    <form
      action={async (formData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
          toast.error("Please provide all fields.");
          return;
        }

        const toastId = toast.loading("Logging in...");

        const error = await credentialsLogin(email, password);

        if (!error) {
          toast.success("Login success!", {
            id: toastId,
          });
          //   redirect user and refresh automatically after login
          router.refresh();
        } else {
          toast.error(String(error), {
            id: toastId,
          });
        }
      }}
      className="card bg-base-100 w-full max-w-md shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">Login</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
