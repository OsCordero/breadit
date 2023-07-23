import { PAGE_SIZE } from "@/config";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostsFeed from "@/app/r/[slug]/components/PostsFeed";

const CustomFeed = async () => {
  const session = await getAuthSession();
  const followedSubreddits = await db.subscription.findMany({
    where: { userId: session?.user?.id },
    select: { subreddit: true },
  });

  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      subreddit: {
        name: {
          in: followedSubreddits.map((sub) => sub.subreddit.name),
        },
      },
    },
    include: {
      votes: true,
      author: true,
      subreddit: true,
      comments: true,
    },
    take: PAGE_SIZE,
  });
  return <PostsFeed initialPosts={posts} session={session} />;
};
export default CustomFeed;
