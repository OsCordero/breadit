"use client";

import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, Link2 } from "lucide-react";
import { Session } from "next-auth";

import UserAvatar from "../../../../components/UserAvatar";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="overflow-hidden rounded-md bg-white shadow dark:bg-slate-800 mb-4">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{ name: session?.user?.name, image: session?.user?.image }}
          />
          <span className="absolute bottom-0 right-0 inline-flex items-center justify-center w-3 h-3 bg-green-500 outline outline-2 outline-white rounded-full" />
        </div>
        <Input readOnly placeholder="Create Post" />
        <Button
          onClick={() => router.push(`${pathname}/submit`)}
          variant={"ghost"}
        >
          <ImageIcon className="text-zinc-600 dark:text-zinc-300" />
        </Button>

        <Button
          onClick={() => router.push(`${pathname}/submit`)}
          variant={"ghost"}
        >
          <Link2 className="text-zinc-500 dark:text-zinc-300" />
        </Button>
      </div>
    </div>
  );
};
export default MiniCreatePost;
