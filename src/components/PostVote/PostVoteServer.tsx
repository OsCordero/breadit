import { notFound } from "next/navigation";
import { Post, Vote, VoteType } from "@prisma/client";

import { getAuthSession } from "@/lib/auth";
import { countVotes } from "@/lib/utils";

import PostVote from "./PostVote";

interface PostVoteServerProps {
  postId: string;
  initialVote?: VoteType;
  initialVoteCount?: number;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({
  postId,
  initialVote,
  initialVoteCount,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let votesCount = 0;
  let currentVote: VoteType | undefined = undefined;

  if (getData) {
    const post = await getData();

    if (!post) return notFound();
    console.log(session);

    votesCount = countVotes(post.votes);
    currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type;
  } else {
    votesCount = initialVoteCount!;
    currentVote = initialVote;
  }
  return (
    <PostVote
      postId={postId}
      initialVote={currentVote}
      initialVoteCount={votesCount}
    />
  );
};
export default PostVoteServer;
