"use client";

import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";

import { formatTimeToNow } from "@/lib/utils";

import EditorOutput from "./EditorOutput";
import PostVote from "./PostVote/PostVote";

interface PostProps {
  subredditName?: string;
  post: Post & { author: User; votes: Vote[] };
  commentCount?: number;
  votesCount: number;
  currentVote?: Vote;
}
const Post = ({
  subredditName,
  post,
  commentCount,
  votesCount,
  currentVote,
}: PostProps) => {
  const postRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  return (
    <div className="rounded shadow">
      <div className="px-6 py-4 flex justify-between relative">
        {session ? (
          <PostVote
            initialVote={currentVote?.type}
            initialVoteCount={votesCount}
            postId={post.id}
          />
        ) : null}
        <div className="flex-1">
          <div className="max-h-40 mt-1 text-xs relative">
            {subredditName ? (
              <>
                <Link
                  href={`/r/${subredditName}`}
                  className="underline text-sm underline-offset-2"
                >
                  r/{subredditName}
                </Link>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>{" "}
            {formatTimeToNow(post.createdAt)}
          </div>
          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <span className="text-lg font-semibold  py-2 leading-6 ">
              {post.title}
            </span>
          </Link>
          <div
            className="relative text-sm max-h-40 w-full text-clip overflow-hidden"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
          </div>
          {(postRef.current?.clientHeight ?? 0) >= 160 ? (
            <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-white via-white via-10% to-transparent dark:from-slate-600 dark:via-slate-600" />
          ) : null}
        </div>
      </div>

      <div className="bg-secondary z-20 text-sm p-4 sm:px-6">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> {commentCount ?? 0} Comments
        </Link>
      </div>
    </div>
  );
};
export default Post;
