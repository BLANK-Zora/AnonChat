import {resend} from '../lib/resend';

import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode : string,
): Promise<ApiResponse>{
    try{
        const hello = await resend.emails.send({
            from: 'AnonChat <csds22177@glbitm.ac.in>', 
            to: email,
            subject: 'AnonChat | Verify your email address',
            react: VerificationEmail({
                username,
                otp: verifyCode,
            }),
        });
        console.log("Email sent successfully",hello);
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    }catch(emailError){
        console.log("Error sending email",emailError);
        return {
            success: false,
            message: "Error sending email",
        }; 
    }
}