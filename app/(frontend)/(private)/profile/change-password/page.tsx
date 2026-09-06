"use client";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "../../../../hooks/useCurrentUser";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../../../../schemas/auth.schema";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";

const ChangePasswordPage = () => {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          reset();
        },

        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Something went wrong while changing password.",
            );
          } else {
            toast.error("Something went wrong.");
          }
        },
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="mb-6 w-full max-w-md">
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-base-content/60 hover:text-base-content"
        >
          ← Back to Profile
        </Link>

        <h1 className="text-2xl font-bold">Change Password</h1>

        <p className="mt-1 text-sm text-base-content/60">
          Update your password to keep your account secure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg border border-base-300 bg-base-100 p-6 shadow"
      >
        <div className="space-y-4">
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            autoComplete="new-password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="mt-6 w-full"
        >
          {changePasswordMutation.isPending
            ? "Changing Password..."
            : "Change Password"}
        </Button>

        <p className="mt-4 text-center text-xs text-base-content/60">
          Your new password must be at least 8 characters long.
        </p>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
