import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { loginToast } from "@/lib/toasts";
import {
  CreateSubredditPayload,
  SubredditSubscriptionPayload,
} from "@/lib/validators/subreddit";
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

export const useSubscribeToSubreddit = (
  subredditId: string,
  subredditName: string
) => {
  const router = useRouter();
  const mutationData = useMutation({
    mutationFn: async () => {
      const payload: SubredditSubscriptionPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: "You are already subscribed",
            description: "You are already subscribed to this community",
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
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        title: "Subscribed!",
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  return mutationData;
};

export const useUnsubscribeToSubreddit = (
  subredditId: string,
  subredditName: string
) => {
  const router = useRouter();
  const mutationData = useMutation({
    mutationFn: async () => {
      const payload: SubredditSubscriptionPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: "You are already unsubscribed",
            description: "You are already unsubscribed from this community",
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
        variant: "destructive",
      });
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        title: "Unubscribed!",
        description: `You are now unsubscribed from r/${subredditName}`,
      });
    },
  });

  return mutationData;
};
