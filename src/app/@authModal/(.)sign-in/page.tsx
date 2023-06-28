"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignIn from "@/components/SignIn";

const Page: FC = () => {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:py-20">
        <SignIn />
      </DialogContent>
    </Dialog>
  );
};
export default Page;
