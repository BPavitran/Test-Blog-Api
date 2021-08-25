import { Util } from "../common/util";
import {NextFunction, Request, Response} from "express";
import { DPost, IPost } from "../schemas/post.model";
import { PostDao } from "../dao/post.dao";
import { UserDao } from "../dao/user.dao";
import { CommentDao } from "../dao/comment.dao";

const Joi = require('@hapi/joi');

export namespace PostEp {

    export async function getAllPosts(req: Request, res: Response){
        try{
            const posts = await PostDao.getAllPosts();
            return Util.sendSuccess(res, posts);
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function getPostsByUserId(req: Request, res: Response){
        try{
            const userId = req.params.userId;
            const posts = await PostDao.getPostsByUserId(userId);
            return Util.sendSuccess(res, posts);
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export function postValidations(post: DPost) {
        const schema = Joi.object({
            title: Joi.string(),
            content: Joi.string(),
            author: Joi.string()
        })

        const {error} = schema.validate({
            title: post.title,
            content: post.content,
            author: post.author
        }, {allowUnknown: true})

        return error;
    }

    export async function createPost(req: Request, res: Response){
        try{
            const postData = req.body;

            const user = await UserDao.getUserById(postData.author);
            if(!user){
                return Util.sendError(res, "Send Correct User Id");
            }

            const error = await postValidations(postData)
            if(!error){
                const author = postData.author;
                const post = await PostDao.createPost(postData);
                const user = await UserDao.getUserById(author);
                const newPostCount = user.numberOfPosts + 1;
                await UserDao.updateUserById(author, {numberOfPosts : newPostCount});
                return Util.sendSuccess(res, post);
            } else {
                return Util.sendError(res, "Please fill post data correctly");
            }
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function updatePost(req: Request, res: Response){
        try{
            const postData = req.body;
            const postId = req.body.id;
            if(!postId){
                return Util.sendError(res, "Please send Post Id");
            }

            const checkPost = await PostDao.getPostById(postId);
            if(!checkPost){
                return Util.sendError(res, "Send Correct Post Id");
            }

            const error = await postValidations(postData)
            if(!error){
                delete postData.id;
                const post = await PostDao.updatePostById(postId, postData);
                return Util.sendSuccess(res, post);
            } else {
                return Util.sendError(res, "Please fill post data correctly");
            }
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function deletePostById(req: Request, res: Response){
        try{
            const postId = req.body.id;
            if(!postId){
                return Util.sendError(res, "Please send Post Id");
            }

            const checkPost = await PostDao.getPostById(postId);
            if(!checkPost){
                return Util.sendError(res, "Send Correct Post Id");
            }
            
            const post = await PostDao.getPostById(postId);
            const author = post.author;
            const commentsIds = post.comments.map((comment : any) => comment.id)
            const user = await UserDao.getUserById(author);
            const newPostCount = user.numberOfPosts - 1;
            await UserDao.updateUserById(user.id, {numberOfPosts : newPostCount});
            await CommentDao.deleteCommentsByids(commentsIds);
            await PostDao.deletePostByid(postId);
            
            return Util.sendSuccess(res, "Successfully Post Deleted");
        } catch (e) {
            return Util.sendError(res, e);
        }
    }
}