import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditSubscriptionSchema } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = subredditSubscriptionSchema.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id },
    });

    if (!subscriptionExists) {
      return new Response("You are not subscribed to this subreddit", {
        status: 400,
      });
    }

    const subreddit = await db.subreddit.findFirst({
      where: { id: subredditId, creatorId: session.user.id },
    });

    if (subreddit) {
      return new Response("You cannot unsubscribe from your own subreddit", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    });

    return new Response(subredditId, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not unsubscribe from subreddit", {
      status: 500,
    });
  }
}
