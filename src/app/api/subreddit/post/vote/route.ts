import { getServerSession } from "next-auth";
import { z } from "zod";

import type { CachedPost } from "@/types/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { countVotes } from "@/lib/utils";
import { votePostSchema } from "@/lib/validators/vote";

const CACHE_AFTER_UPVOTE = 1;

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { postId, voteType } = votePostSchema.parse(body);

    const exisitingVote = await db.vote.findFirst({
      where: { postId, userId: session.user.id },
    });

    const post = await db.post.findUnique({
      where: { id: postId },
      include: { author: true, votes: true },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (exisitingVote) {
      if (exisitingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("Vote removed", { status: 200 });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: { type: voteType },
      });

      const votesCount = countVotes(post.votes);

      if (votesCount >= CACHE_AFTER_UPVOTE) {
        const cachedPayload: CachedPost = {
          authorUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          currentVote: voteType,
          id: post.id,
          title: post.title,
        };

        await redis.hset(`post:${post.id}`, cachedPayload);
      }

      return new Response("Vote updated", { status: 200 });
    }

    await db.vote.create({
      data: {
        type: voteType,
        postId,
        userId: session.user.id,
      },
    });

    const votesCount = countVotes(post.votes);

    if (votesCount >= CACHE_AFTER_UPVOTE) {
      const cachedPayload: CachedPost = {
        authorUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        createdAt: post.createdAt,
        currentVote: voteType,
        id: post.id,
        title: post.title,
      };

      await redis.hset(`post:${post.id}`, cachedPayload);
    }

    return new Response("Vote added", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("There was an errror processing your vote", {
      status: 500,
    });
  }
}
