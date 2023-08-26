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

export async function fetchPosts(pageNumber = 1, peerPage = 20) {
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
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const isNext = thradsCount > skipAmount + threads.length;
    return {
      threads,
      isNext,
    };
  } catch (err) {
    console.log("err:", err);
  }
}

export async function fetchThreadById(threadId: string) {
  connectDB();
  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    throw new Error("Error Fetch Thread:" + err);
  }
}

export async function addCommentToThread(
  threadId: String,
  commentText: string,
  userId: String,
  path: string
) {
  connectDB();
  try {
    // Find the original thread by its ID
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    thread.children.push(savedCommentThread._id);
    await thread.save();
    revalidatePath(path);
  } catch (err) {
    throw new Error("Error Fetch Thread:" + err);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });
  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }
  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectDB();
    const mainThread = await Thread.findById(id).populate("author");
    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
