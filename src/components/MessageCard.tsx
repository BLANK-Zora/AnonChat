"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponse";
import ReplyDialog from "./ReplyDialog";

type MessageCardProps = {
  message: Message;
  username : string;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, username,onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/delete-message", {
        messageId: message._id,
      });

      toast.success(response.data.message, {
        description: "Message deleted successfully",
        duration: 2000,
        richColors: true,
        closeButton: true,
      });

      onMessageDelete(String(message._id));
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete the message. Please try again.");
    }
  };

  return (
    <Card className="relative flex flex-col w-full max-w-lg p-6 shadow-md border border-gray-300 rounded-lg bg-white">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {message.content}
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-500">
            {new Date(message.createAt).toLocaleString()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <ReplyDialog 
          messageId = {String(message._id)}
          username = {username}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-1">
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this message? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
