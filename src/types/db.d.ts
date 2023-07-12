import { Prisma } from "@prisma/client";

const extendedPost = Prisma.validator<Prisma.PostArgs>()({
  include: {
    subreddit: true,
    votes: true,
    comments: true,
    author: true,
  },
});

export type ExtendedPost = Prisma.PostGetPayload<typeof extendedPost>;
