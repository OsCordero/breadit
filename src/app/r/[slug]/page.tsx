import { notFound } from "next/navigation";
import { PAGINE_SIZE } from "@/config";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import MiniCreatePost from "@/components/MiniCreatePost";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: { author: true, comments: true, subreddit: true, votes: true },
        take: PAGINE_SIZE,
      },
    },
  });

  if (!subreddit) {
    return notFound();
  }
  return (
    <div>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
    </div>
  );
};
export default Page;
