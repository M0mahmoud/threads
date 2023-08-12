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

export async function fetchPosts({ pageNumber = 1, peerPage = 20 }) {
  try {
    connectDB();
    const skipAmount = (pageNumber - 1) * peerPage;

    const thradsCount = await Thread.find({
      parentId: { $in: [null, undefined] },
    }).countDocuments();

    const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(peerPage)
      .populate("author");

    const isNext = thradsCount > skipAmount + threads.length;
    return {
      threads,
      isNext,
    };
  } catch (err) {
    console.log("err:", err);
  }
}
