import Link from "next/link";
import { User } from "@prisma/client";

import { getAuthSession } from "@/lib/auth";

import { Icons } from "./Icon";
import SearchBar from "./SearchBar";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2 dark:bg-slate-800 dark:border-slate-700">
      <div className="mx-w-7xl container mx-auto flex h-full items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8" />
            <p className="hidden text-sm font-medium text-zinc-700 md:block dark:text-slate-50">
              Breadit
            </p>
          </Link>
          {session?.user && (
            <a
              href="/discover"
              className={buttonVariants({ variant: "ghost" })}
            >
              Discover
            </a>
          )}
        </div>

        <SearchBar />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <UserAccountNav user={session.user as User} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
