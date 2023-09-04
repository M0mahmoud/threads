"use client";
import { handleLoveClick } from "@/actions/user.action";
import { set } from "mongoose";
import Image from "next/image";
import React, { useState } from "react";
interface Props {
  userId: string;
  threadId: string;
  isLiked: boolean;
  likesNumber: number;
}
const Love = ({ userId, threadId, isLiked, likesNumber }: Props) => {
  const [like, setLike] = useState(isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(likesNumber);

  const handleLove = async () => {
    try {
      const { liked, numberOfLikes } = await handleLoveClick({
        userId,
        threadId,
      });
      setLike(liked);
      setNumberOfLikes(numberOfLikes);
    } catch (error) {
      console.error("Error liking thread: ", error);
    }
  };

  return (
    <div className="flex  items-center gap-1">
      <p className="text-subtle-medium text-gray-1">
        {numberOfLikes == 0 ? "" : numberOfLikes}
      </p>
      {like ? (
        <Image
          src="/assets/heart-filled.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
          onClick={handleLove}
        />
      ) : (
        <Image
          src="/assets/heart-gray.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
          onClick={handleLove}
        />
      )}
    </div>
  );
};

export default Love;
