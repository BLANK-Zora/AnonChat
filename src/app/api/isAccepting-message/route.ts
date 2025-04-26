import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const user = await UserModel.findOne({username});
    if (!user) {
        return Response.json({
            success: false,
            message: "User not found",
            isAcceptingMessage : false
        }, { status: 404 })
    }
    try {
        const isAcceptingMessage = user.isAcceptingMessage;
        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessage : isAcceptingMessage
        }, { status: 200 })   
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in getting user ${error}" ,
            isAcceptingMessage : false
        }, { status: 500 })
    }
    }
