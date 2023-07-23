import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { countVotes } from "@/lib/utils";

import CreateComment from "./CreateComment";
import PostComment from "./PostComment";

interface CommentsSectionProps {
  postId: string;
}
const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: { postId, parentId: null },
    include: {
      author: true,
      votes: true,
      children: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.parentId)
          .map((topLevelComment) => {
            const topLevelCommentVotesCount = countVotes(topLevelComment.votes);

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesCount={topLevelCommentVotesCount}
                    postId={postId}
                  />
                </div>
                {topLevelComment.children.map((childComment) => {
                  const childCommentVotesCount = countVotes(childComment.votes);

                  const childCommentVote = childComment.votes.find(
                    (vote) => vote.userId === session?.user.id
                  );

                  return (
                    <div
                      key={childComment.id}
                      className="ml-4 py-2 pl-4 border-l-2 border-zinc-200"
                    >
                      <PostComment
                        comment={childComment}
                        currentVote={childCommentVote}
                        votesCount={childCommentVotesCount}
                        postId={postId}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default CommentsSection;
