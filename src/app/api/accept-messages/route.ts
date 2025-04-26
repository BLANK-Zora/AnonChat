import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { 
        isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update the user",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User status updated successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Failed to update messages", err);
    return Response.json(
      {
        success: false,
        message: "Failed to udpate user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  try {
    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const userId = user._id;

    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User found",
        data: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}


