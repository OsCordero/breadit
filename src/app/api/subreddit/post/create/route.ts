import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { postSchema } from "@/lib/validators/post";
import { subredditSubscriptionSchema } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId, title, content } = postSchema.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id },
    });

    if (!subscriptionExists) {
      return new Response(
        "You are not joined to this subreddit, please subscribe to post",
        { status: 400 }
      );
    }

    const post = await db.post.create({
      data: {
        subredditId,
        title,
        content,
        authorId: session.user.id,
      },
    });

    return new Response(post.title, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not post to subreddit, please try again later", {
      status: 500,
    });
  }
}
