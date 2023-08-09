"use server";
import { connectDB } from "@/lib/mongoose";
import Thread from "@/models/Thread";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

interface ThreadProps {
  text: string;
  author: string;
  communityId?: string;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: ThreadProps) {
  try {
    connectDB();
    const createThread = await Thread.create({
      text,
      author,
      path,
      communityId: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (err) {
    console.log("Error Creating new thread", err);
  }
}
