import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { loginToast } from "@/lib/toasts";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/components/ui/use-toast";

export const useCreateSubreddit = () => {
  const router = useRouter();

  const mutationData = useMutation({
    mutationKey: ["createCommunity"],
    mutationFn: async (name: string) => {
      const payload: CreateSubredditPayload = {
        name,
      };

      const { data } = await axios.post<string>("/api/subreddit", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists",
            description: "Please choose another name",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name",
            description: "Please choose a name between 3 and 21 characters",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      router.push(`/r/${data}`);
    },
  });

  return mutationData;
};
