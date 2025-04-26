
import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content:  string;
    createAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createAt: { type: Date,required:true, default: Date.now }
})

export interface User extends Document {
    username : string;
    email : string;
    password: string;
    verifyCode : string;
    verifyCodeExpire: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true,"User name is required"], unique: true, trim: true },
    email: { type: String, required: [true,"Email is required"], unique: true , match: [/^\S+@\S+\.\S+$/,'please use a valid email address']},
    password: { type: String, required: [true,"Password is required"] },
    verifyCode: { type: String, required: [true,"verification code is required"] },
    verifyCodeExpire: { type: Date, required: true},
    isVerified: { type: Boolean, default: false },
    isAcceptingMessage: { type: Boolean, default: true },
    messages: [MessageSchema]
})

const UserModel =  mongoose.models.User as mongoose.Model<User> ||mongoose.model<User>('User', UserSchema) ; // for nextjs hot reload

export default UserModel;