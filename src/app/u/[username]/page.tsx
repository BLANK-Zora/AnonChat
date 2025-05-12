'use client';

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Reply } from "@/model/User";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard2 from "@/components/MessageCard2";

const Page = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);


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
          //toast.error("Failed to fetch messages");
        } finally {
          setIsLoading(false);
        }
      },
      [username , setIsLoading, setMessages]
    );
  
  const FormSchema = z.object({
    Message: z
      .string()
      .min(10, { message: "Message must be at least 10 characters." })
      .max(160, { message: "Message must not exceed 160 characters." }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Message: "",
    },
  });

  useEffect(() => {
    const currentUrl = window.location.pathname;
    const extractedUsername = currentUrl.split("/u/").pop() || "";
    setUsername(extractedUsername);

    if (extractedUsername) {
      fetchReplies(false, extractedUsername);
    }
  }, [fetchReplies]);



  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.Message,
      });

      if (response.data.success) {
        form.reset();
        toast.success(response.data.message, {
          description: "Message sent successfully.",
          duration: 2000,
          richColors: true,
          closeButton: true,
        });
      } else {
        toast.error(response.data.message, {
          description: "Please try again later.",
          duration: 2000,
          richColors: true,
          closeButton: true,
        });
      }
    } catch (error) {
      toast.error("Error sending message", {
        description: `${error}`,
        duration: 2000,
        richColors: true,
        closeButton: true,
      });
      console.error("Error sending message:", error);
    }
  };

  return (

    <>
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Send a Message to {username}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 mx-auto"
        >
          <FormField
            control={form.control}
            name="Message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a message to the user"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>

    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">{username}&apos;s Replies</h1>
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
    </>
  );
};

export default Page;
