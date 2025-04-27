'use client';

import { useState, useEffect } from "react";
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

const Page = () => {
  const [username, setUsername] = useState("");
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>();
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
  }, []);

  useEffect(() => {
    const fetchSuggestedMessages = async () => {
      try {
        const response = await axios.get("/api/suggested-message");
        const text = response.data.text as string;
        const messagesArray = text.split("||").map(msg => msg.trim()).filter(msg => msg.length > 0);
        setSuggestedMessages(messagesArray);
      } catch (error) {
        console.error("Error fetching suggested messages:", error);
      }
    };
  
    fetchSuggestedMessages();
  }, []);


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
    </>
  );
};

export default Page;
