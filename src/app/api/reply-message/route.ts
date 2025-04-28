
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import type { Message, Reply } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    
    const { originalMessageId,username, replycontent  } = await request.json();
    
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 401 }
            );
        }

        
        const originalMessage = user.messages.find((message: Message) => message.id.toString() === originalMessageId);
        const newMessage = { originalcontent: originalMessage?.content,replycontent: replycontent, createdAt: new Date() };
        user.replies.push(newMessage as unknown as Reply);
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in sending messages", error);
    return Response.json(
      {
        success: false,
        message: "Error in sending messages",
      },
      { status: 500 }
    );
    }
}  