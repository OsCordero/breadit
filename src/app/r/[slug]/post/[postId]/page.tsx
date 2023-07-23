import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";

import { CachedPost } from "@/types/redis";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import CommentsSection from "@/components/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
// import Post from "@/components/Post";
import PostVoteServer from "@/components/PostVote/PostVoteServer";

interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findUnique({
      where: { id: params.postId },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) {
    return notFound();
  }

  const getPost = async () => {
    return await db.post.findUnique({
      where: { id: params.postId },
      include: {
        votes: true,
      },
    });
  };

  return (
    <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
      <Suspense fallback={<PostVoteShell />}>
        {/* @ts-ignore */}
        <PostVoteServer postId={params.postId} getData={getPost} />
      </Suspense>

      <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm dark:bg-gray-800">
        <p className="max-h-40 mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
          Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
          {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
        </p>
        <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900 dark:text-gray-100">
          {post?.title ?? cachedPost.title}
        </h1>

        <EditorOutput content={post?.content ?? cachedPost.content} />

        <Suspense
          fallback={<Loader2 className="h-5 w-5 animate-spin text-primary" />}
        >
          {/* @ts-ignore */}
          <CommentsSection postId={post?.id ?? cachedPost.id} />
        </Suspense>
      </div>
    </div>
  );
};

export function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5" />
      </div>

      <div className="text-center py-2 font-medium text-sm ">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5" />
      </div>
    </div>
  );
}
export default Page;
