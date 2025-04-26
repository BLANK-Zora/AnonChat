// eslint-disable-next-line no-unused-vars
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request){
    await dbConnect();

    try{
        const {username, email, password} = await request.json();
        console.log("username",username);
        console.log("email",email);
        console.log("password",password);
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already taken",
            },{status: 400})
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(existingUserVerifiedByEmail);
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already taken",
                },{status: 400})
            }else{
                const hashedPassword = await bcrypt.hash(password, 12);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
                await existingUserVerifiedByEmail.save();
            }
        }else{
            console.log("Creating new user");
            const hashedPassword = await bcrypt.hash(password, 12);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1); 
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode ,
                verifyCodeExpire: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
                  
            await newUser.save();
            //console.log(newsave);
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        //console.log("emailResponse",emailResponse);
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            },{status: 500})
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully, please check your email to verify your account",
        },{status: 201})
    }
    catch(error){
        console.error("Error Registering User",error);
        return Response.json({
            success: false,
            message: "Error Registering User",
        },{status:500})
    }
}