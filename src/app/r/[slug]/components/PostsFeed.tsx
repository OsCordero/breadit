"use client";

import { PAGE_SIZE } from "@/config";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";

import { ExtendedPost, ExtendpedPostResponse } from "@/types/db";
import Post from "@/components/Post";

interface PostsFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostsFeed = ({ initialPosts, subredditName }: PostsFeedProps) => {
  const { data: session } = useSession();
  const { ref, inView, entry } = useInView({
    threshold: 1,
    onChange: (inView, entry) => {
      if (inView && entry?.isIntersecting) {
        fetchNextPage();
      }
    },
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["posts", subredditName],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get<ExtendpedPostResponse>(
        `/api/posts?limit=${PAGE_SIZE}&page=${pageParam}&subreddit=${subredditName}`
      );
      return data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (allPages.length < lastPage.totalPosts / PAGE_SIZE) {
          return allPages.length + 1;
        }
      },
      initialData: {
        pages: [{ posts: initialPosts, totalPosts: 100000 }],
        pageParams: [1],
      },
    }
  );

  const posts = data?.pages.flatMap((page) => page.posts) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesCount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UPVOTE") return acc + 1;
          if (vote.type === "DOWNVOTE") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user?.id
        );

        return (
          <li key={post.id} ref={posts.length === index + 1 ? ref : undefined}>
            <Post
              subredditName={post.subreddit.name}
              post={post}
              commentCount={post.comments.length}
              votesCount={votesCount}
              currentVote={currentVote}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default PostsFeed;
