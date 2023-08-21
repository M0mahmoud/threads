import { fetchUser, getActivity } from "@/actions/user.action";
import ActivityCard from "@/components/cards/ActivityCard";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Activity = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className="head-text">Activity</h1>
      <ActivityCard activity={activity} />
    </>
  );
};

export default Activity;
