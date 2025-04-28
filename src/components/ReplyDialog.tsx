"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Reply } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface ReplyDialogProps {
    messageId: string;
    username: string;
}

const ReplyDialog = ({ messageId , username }: ReplyDialogProps) => {
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/reply-message", {
                originalMessageId: messageId,
                username: username,
                replycontent: content,
            });

            if (response.status === 200) {
                toast.success("Reply sent successfully!");
                setContent(""); // Reset the text area
            } else {
                throw new Error("Failed to send reply");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while sending the reply.");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Reply className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reply</DialogTitle>
                    <DialogDescription>Write a reply to this message</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                            Content
                        </Label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="col-span-3 border rounded-md p-2"
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>
                        Send Reply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReplyDialog;
