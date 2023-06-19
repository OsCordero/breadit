"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";

import { Icons } from "./Icon";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      signIn("google");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button isLoading={isLoading} onClick={loginWithGoogle}>
        {isLoading ? null : <Icons.google className="h-5 w-5" />}
        <span className="ml-2">Continue with Google</span>
      </Button>
    </div>
  );
};
export default UserAuthForm;
