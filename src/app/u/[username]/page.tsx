// eslint-disable-next-line no-unused-vars
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponse";

const Page = () => {
  const [username, setUsername] = useState("");
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);

  // ✅ Define schema for the form
  const FormSchema = z.object({
    bio: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 160 characters.",
      }),
  });

  // ✅ Initialize form with zod + react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // ✅ Show form submission data via toast
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  // ✅ Extract username from URL like `/u/yourname`
  useEffect(() => {
    const currentUrl = window.location.pathname;
    const extractedUsername = currentUrl.split("/u/").pop() || "";
    setUsername(extractedUsername);
  }, []);

  // ✅ Fetch isAcceptingMessage using username
  const fetchAcceptMessage = useCallback(async () => {
    if (!username) return;

    try {
      const response = await axios.get<ApiResponse>(
        `/api/isAccepting-message?username=${username}`
      );

      if (typeof response.data.isAcceptingMessage === "boolean") {
        setIsAcceptingMessage(response.data.isAcceptingMessage);
      }
    } catch (error) {
      console.error("Error fetching message status:", error);
    }
  }, [username]); // ✅ include username in dependencies

  useEffect(() => {
    fetchAcceptMessage();
  }, [fetchAcceptMessage]);

  return (
    <>
      <div className="p-6 text-center">
        {isAcceptingMessage
          ? `Accepting messages || ${isAcceptingMessage}`
          : `Not accepting messages || ${isAcceptingMessage}`}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription>
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
