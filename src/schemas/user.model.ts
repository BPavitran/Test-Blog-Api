import * as mongoose from "mongoose";
import {Schema, Types} from "mongoose";
import {schemaOptions} from "../config";

export interface DUser {
    name: string;
    numberOfPosts?: number;
}

export type IUser = DUser & mongoose.Document;

export const UserSchema = new mongoose.Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    numberOfPosts: {
        type: Schema.Types.Number,
        required: false,
        default: 0
    }
}, schemaOptions);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;