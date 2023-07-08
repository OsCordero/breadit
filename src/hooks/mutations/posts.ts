import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { loginToast } from "@/lib/toasts";
import { PostType } from "@/lib/validators/post";
import { toast } from "@/components/ui/use-toast";

export const useCreatePost = () => {
  const router = useRouter();
  const pathname = usePathname();

  const mutationData = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (payload: PostType) => {
      const { data } = await axios.post<string>(
        "/api/subreddit/post/create",
        payload
      );

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "Your post could not be created, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Your post ${data} has been created.`,
      });

      const newPathname = pathname.replace("/submit", "");
      router.push(newPathname);
    },
  });

  return mutationData;
};
