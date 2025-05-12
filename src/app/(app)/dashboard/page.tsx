
"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("Please login to access this page", {
        duration: 2000,
        richColors: true,
        closeButton: true,
      });
      router.push("/sign-in");
    },
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    toast.success("Message deleted successfully", {
      duration: 2000,
      richColors: true,
      closeButton: true,
    });
  };

  const fetchAcceptMessage = useCallback(async () => {
    if (!session || !session.user) return;
    
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Error fetching accept message status",
        {
          duration: 2000,
          richColors: true,
          closeButton: true,
        }
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, session]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      if (!session || !session.user) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Refreshed Messages", {
            description: "Showing latest messages",
            duration: 2000,
            richColors: true,
            closeButton: true,
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("Error fetching messages:", axiosError);
        // toast.error(
        //   axiosError.response?.data.message ||
        //     "Error fetching accept message status",
        //   {
        //     duration: 1000,
        //     richColors: true,
        //     closeButton: true,
        //   }
        // );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages, session]
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchAcceptMessage();
      fetchMessages();
    }
  }, [status, session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessage", !acceptMessages);
      toast.success(response.data.message, {
        duration: 2000,
        richColors: true,
        closeButton: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Error fetching accept message status",
        {
          duration: 2000,
          richColors: true,
          closeButton: true,
        }
      );
    }
  };

  const copyProfileUrl = () => {
    if (!session?.user?.username) return;
    
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${session.user.username}`;
    
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        toast.success("URL copied to clipboard", {
          duration: 2000,
          richColors: true,
          closeButton: true,
        });
      })
      .catch((error) => {
        console.error("Error copying URL", error);
        toast.error("Error copying URL", {
          duration: 2000,
          richColors: true,
          closeButton: true,
        });
      });
      
  };
  if (status === "loading") {
    return <div className="p-6 text-center">Loading...</div>;
  }

 
  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-borded w-full p-2 mr-2"
          />
          <Button onClick={copyProfileUrl}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-lg font-semibold">
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              username = {username}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No message to display</p>
        )}
      </div>
    </div>
  );
};

export default Page;