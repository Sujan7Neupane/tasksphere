import api from "../../lib/axios";

import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
} from "../types/comment.types";

export const getComments = async (
  taskId: string,
): Promise<{ comments: Comment[] }> => {
  const response = await api.get(`/tasks/${taskId}/comments`);

  return response.data;
};

export const createComment = async (
  taskId: string,
  data: CreateCommentData,
) => {
  const response = await api.post(`/tasks/${taskId}/comments`, data);

  return response.data;
};

export const updateComment = async (
  commentId: string,
  data: UpdateCommentData,
) => {
  const response = await api.put(`/comments/${commentId}`, data);

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/comments/${commentId}`);

  return response.data;
};
