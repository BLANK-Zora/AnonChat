import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const {username , code}= await request.json();
    console.log(username, code)
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
        username: decodedUsername
    })
    if(!user){
        return Response.json({
            success: false,
            message: "User not found",
        },{status: 404})
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = user.verifyCodeExpire < new Date(Date.now());

    if(isCodeValid && !isCodeExpired){
        user.isVerified = true;
        await user.save();
        return Response.json({
            success: true,
            message: "User verified successfully",
        },{status: 200})
    }
    else if(!isCodeValid){
        return Response.json({
            success: false,
            message: "Invalid verification code",
        },{status: 400})
    }else if(isCodeExpired){
        return Response.json({
            success: false,
            message: "Verification code expired",
        },{status: 400})
    }
} catch (error) {
    console.log("Error verifying the user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
