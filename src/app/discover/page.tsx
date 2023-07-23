import Link from "next/link";
import { Home } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import GeneralFeed from "@/components/GeneralFeed";

export default async function DiscoverPage() {
  return (
    <section>
      <h1 className="font-bold text-3xl md:text-4xl leading-tight">Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* @ts-ignore */}
        <GeneralFeed />

        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last dark:border-gray-700">
          <div className="bg-emerald-100 px-6 py-4 dark:bg-gray-800">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              Home
            </p>
          </div>
          <div className="-my-3 pt-2 divide-y divide-gray-200 dark:divide-gray-700  px-6 pyy-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-600 dark:text-zinc-200">
                Discover communities you'll love
              </p>
            </div>
            <Link
              className={buttonVariants({ className: "w-full mt-4 mb-6" })}
              href="/r/create"
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
