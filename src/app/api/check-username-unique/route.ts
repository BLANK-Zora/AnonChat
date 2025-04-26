import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";

import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("username Validity", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const errormsg = usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters";
      console.log(errormsg)
      return Response.json(
        {
          success: false,
          message:
            errormsg,
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    // console.log(username);
    const existingVerifiedUser = await UserModel.findOne({
      username
    });
    if (existingVerifiedUser) {
        console.log("existingVerifiedUser",username);
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    } else {
      console.log("username available", username);
      return Response.json(
        {
          success: true,
          message: "Username is available",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error in check username unique", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
