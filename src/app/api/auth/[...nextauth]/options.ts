import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
interface Credentials {
  email: string;
  password: string;
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        if (!credentials) {
          throw new Error("Credentials are required");
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne(
            { 
              email: credentials.email 
            }
          ) as 
          { 
            _id: { toString: () => string },
             isVerified: boolean,
              password: string, 
              toObject: () => object };
      
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isVerified) {
            throw new Error("User not verified");
          }
      
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
      
          if (isPasswordCorrect) {
            return {
              ...user.toObject(),
              _id: user._id.toString(),
            } as User;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err) {
          throw new Error((err as Error).message);
        }
      }
      
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },  
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
      }
      return session;
    },
  },
};
