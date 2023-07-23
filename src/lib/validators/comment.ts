import { z } from "zod";

export const commentSchema = z.object({
  postId: z.string(),
  text: z.string(),
  parentId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof commentSchema>;
