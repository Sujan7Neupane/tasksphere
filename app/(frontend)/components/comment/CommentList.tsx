"use client";

import toast from "react-hot-toast";
import { useComments, useDeleteComment } from "../../../hooks/useComment";
import axios from "axios";
import Button from "../ui/Button";
import { useSession } from "next-auth/react";

type CommentListProps = {
  taskId: string;
};

const CommentList = ({ taskId }: CommentListProps) => {
  const { data, isLoading, isError } = useComments(taskId);
  const deleteComment = useDeleteComment();

  const { data: session } = useSession();
  // console.log(session);

  const handleDelete = (commentId: string) => {
    deleteComment.mutate(commentId, {
      onSuccess: () => {
        toast.success("Comment deleted successfully");
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete comment",
          );
        } else {
          toast.error("Failed to delete comment");
        }
      },
    });
  };

  if (isLoading) {
    return <p className="text-sm text-base-content/70">Loading comments...</p>;
  }

  if (isError) {
    return <p className="text-sm text-error">Failed to load comments.</p>;
  }

  const comments = data?.comments ?? [];

  if (comments.length === 0) {
    return (
      <p className="py-4 text-sm text-base-content/70">No comments yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-md border border-base-300 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{comment.author.name}</p>

              <p className="text-xs text-base-content/60">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>

            {comment.authorId === session?.user?.id && (
              <Button
                type="button"
                onClick={() => handleDelete(comment.id)}
                disabled={deleteComment.isPending}
                className="btn btn-error btn-sm rounded-md"
              >
                {deleteComment.isPending ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>

          <p className="mt-3 text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
