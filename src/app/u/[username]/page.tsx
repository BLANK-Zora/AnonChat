
'use client';

import { useState, useEffect} from "react";
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
  // const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);

  
  const FormSchema = z.object({
    Message: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 160 characters.",
      }),
  });


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    const currentUrl = window.location.pathname;
    const extractedUsername = currentUrl.split("/u/").pop() || "";
    setUsername(extractedUsername);
  }, []);
 
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const content = data.Message;
    
    try {
      const response = await axios
        .post<ApiResponse>("/api/send-message", {
          username,
          content
        })
      if (response.data.success === true) {
        form.reset(); 
        toast.success(response.data.message, {
          description: "Message sent successfully",
          duration: 2000,
          richColors: true,
          closeButton: true,
        });
      }
      else {
        toast.error(response.data.message, {
          description: "Please try again later",
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
      
  }

  // Extract username from URL like `/u/yourname`


  // Fetch isAcceptingMessage using username
  // const fetchAcceptMessage = useCallback(async () => {
  //   if (!username) return;

  //   try {
  //     const response = await axios.get<ApiResponse>(
  //       `/api/isAccepting-message?username=${username}`
  //     );

  //     if (typeof response.data.isAcceptingMessage === "boolean") {
  //       setIsAcceptingMessage(response.data.isAcceptingMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching message status:", error);
  //   }
  // }, [username]); 

  // useEffect(() => {
  //   fetchAcceptMessage();
  // }, [fetchAcceptMessage]);

  return (
    <>
      {/* <div className="p-6 text-center">
        {isAcceptingMessage
          ? `Accepting messages || ${isAcceptingMessage}`
          : `Not accepting messages || ${isAcceptingMessage}`}
      </div> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default Page;
