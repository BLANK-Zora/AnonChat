import { Message, Reply } from "@/model/User";
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Message[];
    replies?: Reply[];
}