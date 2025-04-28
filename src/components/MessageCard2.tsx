"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Reply } from "@/model/User";

type MessageCardProps = {
  message: Reply;
};

const MessageCard2 = ({ message}: MessageCardProps) => {

  return (
    <Card className="relative flex flex-col w-full max-w-lg p-6 shadow-md border border-gray-300 rounded-lg bg-white">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {message.originalcontent}
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-500">
            {message.replycontent}
          </CardDescription>
          <CardDescription className="mt-2 text-sm text-gray-500">
            {new Date(message.createAt).toLocaleString()}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard2;
