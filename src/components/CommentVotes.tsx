"use client";

import { useEffect, useRef, useState } from "react";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { loginToast } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import { VoteCommentRequest } from "@/lib/validators/vote";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CommentVoteProps {
  commentId: string;
  initialVote?: VoteType;
  initialVoteCount: number;
}

const CommentVote = ({
  commentId,
  initialVote,
  initialVoteCount,
}: CommentVoteProps) => {
  const [votesCount, setVotesCount] = useState(initialVoteCount);
  const [vote, setVote] = useState(initialVote);
  const previousVote = useRef(initialVote);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["vote"],
    mutationFn: async (voteType: VoteType) => {
      const payload: VoteCommentRequest = {
        commentId: commentId,
        voteType: voteType,
      };
      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UPVOTE") setVotesCount((prev) => prev - 1);
      else setVotesCount((prev) => prev + 1);

      setVote(previousVote.current);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Your vote could not be processed. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      previousVote.current = vote;
    },
  });

  const handleVote = async (voteType: VoteType) => {
    if (vote === voteType) {
      setVote(undefined);
      if (voteType === "UPVOTE") setVotesCount((prev) => prev - 1);
      else setVotesCount((prev) => prev + 1);
    } else {
      setVote(voteType);
      if (voteType === "UPVOTE")
        setVotesCount((prev) => prev + (vote === "DOWNVOTE" ? 2 : 1));
      else setVotesCount((prev) => prev - (vote === "UPVOTE" ? 2 : 1));
    }

    mutate(voteType);
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        aria-label="Upvote"
        onClick={() => handleVote("UPVOTE")}
        disabled={isLoading}
      >
        <ArrowBigUp
          className={cn("w-5 h-5", {
            "text-emerald-500 fill-emerald-500": vote === "UPVOTE",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm">{votesCount}</p>

      <Button
        size="sm"
        variant="ghost"
        aria-label="Downvote"
        onClick={() => handleVote("DOWNVOTE")}
        disabled={isLoading}
      >
        <ArrowBigDown
          className={cn("w-5 h-5", {
            "text-red-500 fill-red-500": vote === "DOWNVOTE",
          })}
        />
      </Button>
    </div>
  );
};
export default CommentVote;
