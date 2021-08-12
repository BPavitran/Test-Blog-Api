import { DComment } from './../schemas/comment.model';
import Comment, { IComment } from "../schemas/comment.model";

export namespace CommentDao {
    export async function getCommentsByIds(commentsIds: any[]){
        const comments : IComment[] = await Comment.find({_id : {$in : commentsIds}}).populate(['author', 'post']);
        return comments; 
    }

    export async function getCommentById(commentId: string){
        const comment : IComment = await Comment.findOne({_id: commentId}).populate(['author', 'post']);
        return comment; 
    }

    export async function getCommentsByAuthor(userId: string){
        const comments : IComment[] = await Comment.find({author: userId}).populate(['author', 'post']);
        return comments; 
    }

    export async function createComment(data: DComment) {
        const iComment = new Comment(data);
        let comment = await iComment.save();
        return await getCommentById(comment.id);
    }

    export async function updateCommentById(commentId: string, data: Partial<DComment>){
        const comment = await Comment.findByIdAndUpdate({_id : commentId}, { $set: data}, {new : true}).populate(['author', 'post']);
        return comment;
    }

    export async function deleteCommentByid(commentId: string){
        await Comment.deleteOne({_id: commentId});
        return "Comment Deleted";
    }

    export async function deleteCommentsByids(commentIds: string[]){
        await Comment.deleteMany({_id: { $in : commentIds} });
        return "Comment Deleted";
    }
}