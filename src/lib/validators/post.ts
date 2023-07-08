import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters long"),
  content: z.any(),
  subredditId: z.string(),
});

export type PostType = z.infer<typeof postSchema>;
