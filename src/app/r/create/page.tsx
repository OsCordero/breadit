"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateSubreddit } from "@/hooks/mutations/subreddits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { mutate: createCommunity, isLoading } = useCreateSubreddit();

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white dark:bg-gray-800 w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="border-gray-300 dark:border-gray-600" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400 dark:text-zinc-300">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            disabled={input.length < 3 || isLoading}
            onClick={() => createCommunity(input)}
            isLoading={isLoading}
          >
            Create community
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Page;
