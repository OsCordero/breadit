import { z } from "zod";

export const votePostSchema = z.object({
  postId: z.string(),
  voteType: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export type VotePostRequest = z.infer<typeof votePostSchema>;

export const voteCommentSchema = z.object({
  commentId: z.string(),
  voteType: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export type VoteCommentRequest = z.infer<typeof voteCommentSchema>;
