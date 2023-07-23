import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentSchema } from "@/lib/validators/comment";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, parentId } = commentSchema.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // if no existing vote, create a new vote
    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        parentId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not commment on post at this time, please try again later.",
      { status: 500 }
    );
  }
}
