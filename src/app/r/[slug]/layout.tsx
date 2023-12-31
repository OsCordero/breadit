import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button, buttonVariants } from "@/components/ui/button";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: { author: true, votes: true },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          userId: session.user.id,
          subreddit: { name: slug },
        },
      });

  const isSubscribed = Boolean(subscription);

  if (!subreddit) {
    return notFound();
  }

  const membersCount = await db.subscription.count({
    where: {
      subreddit: { name: slug },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>

          {/* info siodebar */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{slug}</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white dark:bg-slate-800">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="text-gray-700 dark:text-gray-200">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, "MMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500 dark:text-gray-400">Members</dt>
                <dd className="text-gray-700 dark:text-gray-200">
                  {membersCount}
                </dd>
              </div>

              {subreddit.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p>You created this community</p>
                </div>
              ) : null}

              {subreddit.creatorId !== session?.user.id ? (
                <SubscribeLeaveToggle
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}
              <Link
                href={`/r/${subreddit.name}/submit`}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-8 !border-b dark:!outline-white",
                })}
              >
                Create a post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
