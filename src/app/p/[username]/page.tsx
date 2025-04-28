"use client";
import MessageCard2 from "@/components/MessageCard2";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reply } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [messages, setMessages] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useForm({
    resolver: zodResolver(acceptMessageSchema),
  });


  const [username, setUsername] = useState("");
  const fetchReplies = useCallback(
    async (refresh: boolean = false, usernameParam: string = username) => {
      if (!usernameParam) {
        console.warn("No username available, skipping API call");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/get-replies/${usernameParam}`);
        setMessages(response.data.replies || []);
        if (refresh) {
          toast.success("Refreshed Messages", {
            description: "Showing latest messages",
            duration: 2000,
            richColors: true,
            closeButton: true,
          });
        }
      } catch (error) {
        console.error("Error fetching replies:", error);
        toast.error("Failed to fetch messages");
      } finally {
        setIsLoading(false);
      }
    },
    [username , setIsLoading, setMessages]
  );

  useEffect(() => {
    const currentUrl = window.location.pathname;
    const extractedUsername = currentUrl.split("/p/")[1] || "";
    setUsername(extractedUsername);

    if (extractedUsername) {
      fetchReplies(false, extractedUsername);
    }
  }, [fetchReplies]);

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchReplies(true);
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
          messages.map((message) => {
            return (
              <MessageCard2
                key={message.id}
                message={message}
              />
            );
          })
        ) : (
          <p>No message to display</p>
        )}
      </div>
    </div>
  );
};

export default Page;
