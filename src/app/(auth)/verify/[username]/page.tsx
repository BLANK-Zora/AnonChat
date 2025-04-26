
'use client';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OctagonAlert } from "lucide-react";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { infer as zInfer } from "zod";
const VerifyAccount = () => {
  
  
    const router = useRouter();
  const param = useParams<{ username: string }>();
  const form = useForm<zInfer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: zInfer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });

      toast("Success", {
        description: response.data.message,
      });

      router.replace(`/sign-in`);
    } catch (error) {
      console.error("Error signup user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Error signing up";
      toast("Error Message", {
        description: errorMessage,
        duration: 3000,
        richColors: true,
        style: {
            backgroundColor: "#fff",                 // White background
            color: "#000",                           // Black text
            border: "1px solid #ccc",               // Light gray border
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Softer, more modern shadow
            padding: "10px 20px",                   // Comfortable padding
            borderRadius: "8px",                    // Rounded corners
            fontWeight: "500",                      // Slightly bolder text
            fontSize: "14px",                       // Readable font size
            maxWidth: "400px",                      // Limit width for better layout
          },
        closeButton: true,
        icon: <OctagonAlert size={16} />,
    });
    }
  };

  return (
    <div
      className="flex justify-center
    items-center min-h-screen bg-gray-100"
    >
      <div
        className="w-full max-w-md p-8 space-y-8 
        bg-white rounded-lg shadow-md"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your account
          </h1>
          <p className="mb-4">
            Enter the verification code sent to your email address.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="code"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel >Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
