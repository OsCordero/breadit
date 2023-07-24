import Image from "next/image";
import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Icons } from "./Icon";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "username" | "image">;
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            referrerPolicy="no-referrer"
            alt={user.username || ""}
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.username}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
export default UserAvatar;
