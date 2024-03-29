import { Util } from "../common/util";
import {NextFunction, Request, Response} from "express";
import { CommentDao } from "../dao/comment.dao";
import { DComment, IComment } from "../schemas/comment.model";
import { PostDao } from "../dao/post.dao";
import Post from "../schemas/post.model";
import { UserDao } from "../dao/user.dao";

const Joi = require('@hapi/joi');

export namespace CommentEp {

    export async function getCommentsByPostId(req: Request, res: Response){
        try{
            const postId = req.params.postId;
            if(!postId){
                return Util.sendError(res, "Please send Post Id");
            }
            const post = await PostDao.getPostById(postId);
            const commentsIds = post.comments.map((comment : any) => comment.id)
            const posts = await CommentDao.getCommentsByIds(commentsIds);
            return Util.sendSuccess(res, posts);
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export function commentValidations(comment: DComment) {
        const schema = Joi.object({
            content: Joi.string(),
            author: Joi.string(),
            //post: Joi.string()
        })

        const {error} = schema.validate({
            content: comment.content,
            author: comment.author,
            //post: comment.post
        }, {allowUnknown: true})

        return error;
    }

    export async function createComment(req: Request, res: Response){
        try{
            const postId = req.body.postId;
            if(!postId){
                return Util.sendError(res, "Please send Comment related Post Id");
            }

            const checkPost = await PostDao.getPostById(postId);
            if(!checkPost){
                return Util.sendError(res, "Send Correct Post Id");
            }

            const checkAuthor = await UserDao.getUserById(req.body.author);
            if(!checkAuthor){
                return Util.sendError(res, "Send Correct Author Id");
            }

            delete req.body.postId;
            const commentData : DComment = req.body;
            const error = await commentValidations(commentData)
            if(!error){
                const comment = await CommentDao.createComment(commentData);
                let post = await PostDao.getPostById(postId);
                post.comments.push(comment.id);
                delete post.id;
                await PostDao.updatePostById(postId, post);
                return Util.sendSuccess(res, comment);
            } else {
                return Util.sendError(res, "Please fill comment data correctly");
            }
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function updateComment(req: Request, res: Response){
        try{
            const commentData = req.body;
            const commentId = req.body.id;
            if(!commentId){
                return Util.sendError(res, "Please send Comment Id");
            }

            const checkComment = await CommentDao.getCommentById(commentId);
            if(!checkComment){
                return Util.sendError(res, "Send Correct Post Id");
            }

            const error = await commentValidations(commentData)
            if(!error){
                delete commentData.id;
                const comment = await CommentDao.updateCommentById(commentId, commentData);
                return Util.sendSuccess(res, comment);
            } else {
                return Util.sendError(res, "Please fill comment data correctly");
            }
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function deleteCommentById(req: Request, res: Response){
        try{
            const commentId = req.body.id;
            if(!commentId){
                return Util.sendError(res, "Please send Comment Id");
            }

            const checkComment = await CommentDao.getCommentById(commentId);
            if(!checkComment){
                return Util.sendError(res, "Send Correct Post Id");
            }

            let post = await PostDao.getPostByCommentId(commentId);
            const index = post.comments.indexOf(commentId);
            post.comments.splice(index, 1);
            const postId = post.id;
            delete post.id;
            await PostDao.updatePostById(postId, post);
            await CommentDao.deleteCommentByid(commentId);
            
            return Util.sendSuccess(res, "Successfully Comment Deleted");
        } catch (e) {
            return Util.sendError(res, e);
        }
    }
}