"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  infer as zInfer } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import {   useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  
  const debounce = useDebounceCallback(setUsername, 500);
  // zod implementation

  const form = useForm<zInfer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
 

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: zInfer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      //basically making new user in the db
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast(String(response.data.success), {
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error signup user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Error signing up";
      toast("Error Message", {
        description: errorMessage,
      });
      setIsSubmitting(false);
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
            Sign up to start sending and receiving anonymous messages.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      debounce(e.target.value);
                    }}
                    />
                    
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" 
                    {...field} 
                    />
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
                    <Input type="password" placeholder="password" 
                    {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait...
                </>
              ) : ("Sign Up")
              }
            </Button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default page;
