import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const session = await getServerSession(authOptions);
  const discover = url.searchParams.get("discover");
  console.log(discover);

  let followedSubredditsIds: string[] = [];

  if (session && !discover) {
    const followedSubreddits = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: { subreddit: true },
    });

    followedSubredditsIds = followedSubreddits.map(
      (subreddit) => subreddit.subredditId
    );
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.number().int().positive().default(25),
        page: z.number().int().positive().default(1),
        subredditName: z.string().optional(),
      })
      .parse({
        subredditNamme: url.searchParams.get("subredditName"),
        limit: parseInt(url.searchParams.get("limit") ?? "25"),
        page: parseInt(url.searchParams.get("page") ?? "1"),
      });

    let whereClause = {};

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session && !discover) {
      whereClause = {
        subredditId: {
          in: followedSubredditsIds,
        },
      };
    } else if (discover) {
      whereClause = {};
    }

    const posts = await db.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    const totalPosts = await db.post.count({
      where: whereClause,
    });

    return new Response(JSON.stringify({ posts, totalPosts }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not fetch posts, please try again later", {
      status: 500,
    });
  }
}
