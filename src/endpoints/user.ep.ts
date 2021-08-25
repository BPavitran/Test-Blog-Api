import { Util } from "../common/util";
import {NextFunction, Request, Response} from "express";
import { DUser, IUser } from "../schemas/user.model";
import { UserDao } from "../dao/user.dao";
import { PostDao } from "../dao/post.dao";
import { CommentDao } from "../dao/comment.dao";

const Joi = require('@hapi/joi');

export namespace UserEp {

    export async function getAllUsers(req: Request, res: Response){
        try{
            const users = await UserDao.getAllUsers();
            return Util.sendSuccess(res, users);
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function signIn(req: Request, res: Response){
        try{
            const userName = req.body.name;
            const alreadyExistsUser = await UserDao.getUserByName(userName);
            if(!alreadyExistsUser){
                const newUserData : DUser = {
                    name : userName,
                    numberOfPosts : 0
                }
                const user = await UserDao.createUser(newUserData);
                return Util.sendSuccess(res, user);
            } else {
                return Util.sendSuccess(res, alreadyExistsUser);
            }
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export function userUpdateValidations(user: IUser) {
        const schema = Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            numberOfPosts: Joi.number()
        })

        const {error} = schema.validate({
            id: user.id,
            name: user.name,
            numberOfPosts: user.numberOfPosts
        }, {allowUnknown: true})

        return error;
    }

    export async function updateUser(req: Request, res: Response){
        try{
            const userUpdatedData = req.body;
            const userId = req.body.id;
            if(!userId){
                return Util.sendError(res, "Send User Id");
            }

            const user = await UserDao.getUserById(userId);
            if(!user){
                return Util.sendError(res, "Send Correct User Id");
            }

            const error = await userUpdateValidations(userUpdatedData);
            if(!error){
                delete userUpdatedData.id;
                const updatedUser = await UserDao.updateUserById(userId, userUpdatedData);
                return Util.sendSuccess(res, updatedUser);
            } else {
                return Util.sendError(res, "Send User Data Correctly");
            }
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

    export async function deleteUserById(req: Request, res: Response){
        try{
            const userId = req.body.id;
            if(!userId){
                return Util.sendError(res, "Send User Id");
            }

            const user = await UserDao.getUserById(userId);
            if(!user){
                return Util.sendError(res, "Send Correct User Id");
            }

            const posts = await PostDao.getPostsByUserId(userId);
            let commentsIds : any[] = [];
            const postsIds = posts.map(post => post.id);
            const postsComments = posts.map(post => post.comments);
            for(const com of postsComments){
                const comId = com.map((c : any) => c.id);
                commentsIds = [...comId];
            }
            const otherComments = await CommentDao.getCommentsByAuthor(userId);
            const otherCommentsIds = otherComments.map(com => com.id);
            commentsIds = [...commentsIds, ...otherCommentsIds];
            const uniqueArray = commentsIds.filter(function(item, pos) {
                return commentsIds.indexOf(item) == pos;
            })

            await UserDao.deleteUserByid(userId);
            await PostDao.deletePostsByids(postsIds);
            await CommentDao.deleteCommentsByids(uniqueArray);
            
            return Util.sendSuccess(res, "Successfully User Deleted");
        } catch (e) {
            return Util.sendError(res, e);
        }
    }

}