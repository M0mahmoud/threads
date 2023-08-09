import { fetchUser } from "@/actions/user.action";
import PostThread from "@/components/forms/PostThread";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const NewThread = async () => {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create New Thread</h1>
      <PostThread userId={String(userInfo._id)} />
    </>
  );
};

export default NewThread;
