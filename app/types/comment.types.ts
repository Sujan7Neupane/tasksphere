export type CommentAuthor = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  taskId: string;
  authorId: string;
  author: CommentAuthor;
};

export type CreateCommentData = {
  content: string;
};

export type UpdateCommentData = {
  content: string;
};
