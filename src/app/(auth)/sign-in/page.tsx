"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { infer as zInfer } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, OctagonAlert } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // zod implementation
  const form = useForm<zInfer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: zInfer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (result?.error) {
      toast.error("Login Failed", {
        description: result.error,
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "#fff", // White background
          color: "#000", // Black text
          border: "1px solid #ccc", // Light gray border
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Softer, more modern shadow
          padding: "10px 20px", // Comfortable padding
          borderRadius: "8px", // Rounded corners
          fontWeight: "500", // Slightly bolder text
          fontSize: "14px", // Readable font size
          maxWidth: "400px", // Limit width for better layout
        },
        closeButton: true,
        icon: <OctagonAlert size={16} />,
      });
    } 

    if(result?.url){
      console.log(result)
      router.replace('/dashboard');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anon Message
          </h1>
          <p className="mb-4">
            Sign In to start sending and receiving anonymous messages.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign Ip"
              )}
            </Button>
          </form>
          <div className="text-center mt-4">
            <p>
              Create an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default page;
