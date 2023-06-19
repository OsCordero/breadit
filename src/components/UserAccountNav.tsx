"use client";

import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

import UserAvatar from "./UserAvatar";

interface UserAccountNavProps {
  user: Pick<User, "name" | "email" | "image">;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className="h-8  w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-slate-800" align="end">
        <DropdownMenuLabel className=" text-zinc-700 dark:text-slate-50">
          <div className="flex flex-col">
            <span className="capitalize">{user.name}</span>
            <span className="font-medium">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className=" text-zinc-700 dark:text-slate-50 dark:hover:bg-slate-700">
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className=" text-zinc-700 dark:text-slate-50 dark:hover:bg-slate-700 "
          asChild
        >
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-zinc-700 dark:text-slate-50 dark:hover:bg-slate-700"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserAccountNav;
