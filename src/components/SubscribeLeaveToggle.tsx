"use client";

import {
  useSubscribeToSubreddit,
  useUnsubscribeToSubreddit,
} from "@/hooks/mutations/subreddits";

import { Button } from "./ui/button";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}
const SubscribeLeaveToggle = ({
  subredditId,
  subredditName,
  isSubscribed,
}: SubscribeLeaveToggleProps) => {
  const { mutate: subscribe, isLoading: isSubscribing } =
    useSubscribeToSubreddit(subredditId, subredditName);
  const { mutate: unsubscribe, isLoading: isUnsubscribing } =
    useUnsubscribeToSubreddit(subredditId, subredditName);

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unsubscribe()}
      isLoading={isUnsubscribing}
      disabled={isUnsubscribing}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => subscribe()}
      isLoading={isSubscribing}
      disabled={isSubscribing}
    >
      Join to post
    </Button>
  );
};
export default SubscribeLeaveToggle;
