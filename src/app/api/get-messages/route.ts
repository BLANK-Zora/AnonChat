// eslint-disable-next-line no-unused-vars
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
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
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const userWithMessages = await UserModel.aggregate([
        {$match: {_id: userId}},
        {$unwind: "$messages"},
        {$sort: {"messages.createdAt": -1}},
        {$group: {_id: "$_id", messages: {$push: "$messages"}}}
    ])
    if(!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Failed to get messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
        {
          success: false,
          messages: userWithMessages[0].messages,
          message: "Messages fetched successfully",
        },
        { status: 200 }
      );
  } catch (error) {
    console.log("Error in getting messages", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting messages",
      },
      { status: 500 }
    );
  }
}
