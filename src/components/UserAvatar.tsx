import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";

import { Icons } from "./Icon";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
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
            alt={user.name || ""}
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
export default UserAvatar;
