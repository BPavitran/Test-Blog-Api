import * as mongoose from "mongoose";
import {Schema, Types} from "mongoose";
import {schemaOptions} from "../config";
import User from "./user.model";
import Comment from "./comment.model";

export interface DPost {
    title:  string;
    content: string;
    author: Types.ObjectId;
    comments?: Types.ObjectId[];
}

export type IPost = DPost & mongoose.Document;

export const PostSchema = new mongoose.Schema({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    content: {
        type: Schema.Types.String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: User.modelName,
        required: true,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: Comment.modelName,
        required: true,
    }]
}, schemaOptions);

// PostSchema.virtual('comments', {
//     ref: Comment.modelName,
//     localField: '_id',
//     foreignField: 'post',
// });

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;