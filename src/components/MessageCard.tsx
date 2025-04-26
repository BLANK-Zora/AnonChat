"use client";
import React from "react";
import {
  Card,
  CardContent,
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
import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );

    toast.success(response.data.message, {
      description: "Message deleted successfully",
      duration: 2000,
      richColors: true,
      closeButton: true,
    });
    onMessageDelete(String(message._id));
  };
  return (
    <>
      <Card className="relative justify-between flex w-full max-w-sm h-auto p-4 shadow-lg border border-gray-200 sm:max-w-md md:max-w-lg lg:max-w-xl">
      
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-xl font-bold text-blue-600">
          {message.content}
        </CardTitle>
        <AlertDialog>
          <AlertDialogTrigger>
        <Button
          variant="destructive"
          className="flex items-center gap-1"
        >
          <X className="w-5 h-5" />
          Delete Message
        </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This message will be deleted permanently. Are you sure?
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
      </CardHeader>
      
      <CardDescription className="relative bottom-4 left-4 text-gray-500 text-sm">
        <p>{String(message.createAt)}</p>
      </CardDescription>
      </Card>
    </>
  );
};

export default MessageCard;
