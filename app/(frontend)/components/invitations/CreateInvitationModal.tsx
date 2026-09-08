"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { useCreateInvitation } from "../../../hooks/useInvitations";
import {
  InvitationFormData,
  invitationSchema,
} from "../../../schemas/invitation.schema";
import { AxiosError } from "axios";

interface CreateInvitationModalProps {
  workspaceId: string;
  onClose: () => void;
}

const CreateInvitationModal = ({
  workspaceId,
  onClose,
}: CreateInvitationModalProps) => {
  const createInvitation = useCreateInvitation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
  });

  const onSubmit = (data: InvitationFormData) => {
    createInvitation.mutate(
      {
        workspaceId,
        email: data.email,
      },
      {
        onSuccess: () => {
          toast.success("Invitation sent successfully");

          reset();
          onClose();
        },

        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string }>;

          toast.error(
            axiosError.response?.data?.message || "Failed to send invitation",
          );
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-xl font-bold">Invite Member</h2>

        <p className="mb-6 text-sm text-gray-500">
          Enter the email address of the user you want to invite.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter valid email"
            {...register("email")}
            error={errors.email?.message}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={createInvitation.isPending}>
              {createInvitation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvitationModal;
