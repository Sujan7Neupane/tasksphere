"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCreateComment } from "../../../hooks/useComment";
import {
  CreateCommentData,
  createCommentSchema,
} from "../../../schemas/comment.schema";
import Button from "../ui/Button";

type CreateCommentFormProps = {
  taskId: string;
};

const CreateCommentForm = ({ taskId }: CreateCommentFormProps) => {
  const createComment = useCreateComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: CreateCommentData) => {
    createComment.mutate(
      {
        taskId,
        data,
      },
      {
        onSuccess: () => {
          toast.success("Comment added successfully");
          reset();
        },

        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to add comment",
            );
          } else {
            toast.error("Failed to add comment");
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="label">
          <span className="label-text">Add a comment</span>
        </label>

        <textarea
          {...register("content")}
          placeholder="Write your comment..."
          className="textarea textarea-bordered w-full rounded-md"
          rows={4}
        />

        {errors.content && (
          <p className="mt-1 text-sm text-error">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={createComment.isPending}>
          {createComment.isPending ? "Adding..." : "Add Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CreateCommentForm;
