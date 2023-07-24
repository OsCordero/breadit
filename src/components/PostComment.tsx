"use client";

import { FC, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment, CommentVote, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import UserAvatar from "@/components/UserAvatar";

import CommentVoteComponent from "./CommentVotes";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesCount: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesCount,
  currentVote,
  postId,
}) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>(`@${comment.author.username} `);
  const router = useRouter();

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, parentId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, parentId };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment/`,
        payload
      );
      return data;
    },

    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            username: comment.author.username || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            u/{comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500 dark:text-zinc-300">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2 dark:text-zinc-100">
        {comment.text}
      </p>

      <div className="flex gap-2 items-center">
        <CommentVoteComponent
          commentId={comment.id}
          initialVoteCount={votesCount}
          initialVote={currentVote?.type}
        />

        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant="ghost"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
      </div>

      {isReplying ? (
        <div className="grid w-full gap-1.5 mt-2">
          <Label htmlFor="comment">Your comment</Label>
          <form
            className="mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input) return;
              postComment({
                postId,
                text: input,
                parentId: comment.parentId ?? comment.id, // default to top-level comment
              });
            }}
          >
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                )
              }
              autoFocus
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="What are your thoughts?"
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                tabIndex={-1}
                variant="outline"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Post
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
