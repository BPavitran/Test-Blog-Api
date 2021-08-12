import * as mongoose from "mongoose";
import {Schema, Types} from "mongoose";
import {schemaOptions} from "../config";
import Post from "./post.model";
import User from "./user.model";

export interface DComment {
    content: string;
    author: Types.ObjectId;
    //post: Types.ObjectId;
}

export type IComment = DComment & mongoose.Document;

export const CommentSchema = new mongoose.Schema({
    content: {
        type: Schema.Types.String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // post: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Post',
    // }
}, schemaOptions);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;