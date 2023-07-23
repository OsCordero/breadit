import { PAGE_SIZE } from "@/config";

import { db } from "@/lib/db";
import PostsFeed from "@/app/r/[slug]/components/PostsFeed";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      votes: true,
      author: true,
      subreddit: true,
      comments: true,
    },
    take: PAGE_SIZE,
  });
  return <PostsFeed initialPosts={posts} discover />;
};
export default GeneralFeed;
