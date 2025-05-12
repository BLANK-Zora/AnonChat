import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";
import mongoose from "mongoose";

import { NextRequest } from "next/server";


export async function GET(
    _request: NextRequest,
    __param_type__: { params: Promise<{ username: string }> }
) {
    
  await dbConnect();
  const { params } =  __param_type__;
  const { username } = await params;
  
  const user = await UserModel.findOne({ username });
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }
  
  const userId = new mongoose.Types.ObjectId(String(user._id));
  try {
    const userWithReplies = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$replies" },
      { $sort: { "replies.createdAt": -1 } },
      { $group: { _id: "$_id", replies: { $push: "$replies" } } }
    ]).exec();
    
    if (!userWithReplies || userWithReplies.length === 0) {
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
        success: true,
        replies: userWithReplies[0].replies.reverse(),
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
