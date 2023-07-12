import { notFound } from "next/navigation";

import { db } from "@/lib/db";

import Editor from "./components/Editor";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;
  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    },
  });

  if (!subreddit) {
    return notFound();
  }
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pp-b-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
            Create a post
          </h3>

          <p className="ml-2 mt-1  text-sm text-muted-foreground">
            in r/{subreddit.name}
          </p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} />
    </div>
  );
};
export default Page;
