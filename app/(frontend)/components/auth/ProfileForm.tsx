"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "../ui/FormInput";
import Button from "../ui/Button";

import { ProfileFormData, profileSchema } from "../../../schemas/auth.schema";

import {
  useCurrentUser,
  useUpdateProfile,
} from "../../../hooks/useCurrentUser";
import Link from "next/link";

const ProfileForm = () => {
  const { data: user, isLoading } = useCurrentUser();
  //   console.log("profile page:", user);

  const updateProfileMutation = useUpdateProfile();

  const [preview, setPreview] = useState<string | null>(null); //image preview

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    // console.log(data);

    try {
      console.log("Selected image:", data.image?.[0]);

      const formData = new FormData();

      formData.append("name", data.name);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const response = await updateProfileMutation.mutateAsync(formData);

      toast.success(response.message);

      if (response.user.image) {
        setPreview(response.user.image);
      }
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Unable to load profile.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-lg border border-base-300 bg-base-100 p-6 shadow"
    >
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Profile Image</span>
        </label>

        {(preview || user.image) && (
          <img
            src={preview || user.image || ""}
            alt="Profile"
            className="mb-3 h-16 w-16 rounded-full object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="file-input w-full rounded-md file:rounded-none"
          {...register("image", {
            onChange: handleImageChange,
          })}
        />
      </div>
      <FormInput
        className="mb-4"
        label="Name"
        type="text"
        placeholder="Enter your name"
        error={errors.name?.message}
        defaultValue={user.name}
        {...register("name")}
      />
      <FormInput
        className="mb-4"
        label="Email"
        type="email"
        value={user.email}
        disabled
      />
      <Button
        type="submit"
        className="w-full"
        disabled={updateProfileMutation.isPending}
      >
        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
      <div className="mt-5 border-t border-base-300 pt-4">
        <p className="text-sm font-medium">Security</p>

        <p className="mt-1 text-xs text-base-content/60">
          Keep your account secure by using a strong, unique password.
        </p>

        <Link
          href="/profile/change-password"
          className="btn btn-outline rounded-sm mt-3 w-full"
        >
          Change Password
        </Link>
      </div>
    </form>
  );
};

export default ProfileForm;
