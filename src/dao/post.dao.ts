import { IPost } from './../schemas/post.model';
import Post, { DPost } from "../schemas/post.model";
import { IComment } from '../schemas/comment.model';
import { UserDao } from './user.dao';
import { CommentDao } from './comment.dao';

export namespace PostDao {

    export async function getAllPosts(){
        const posts : IPost[] = await Post.find().populate([{path: 'author'}, {path : 'comments', populate: {path: 'author'}
        }]);
        return posts; 
    }

    export async function getPostsByUserId(userId: string){
        const posts : IPost[] = await Post.find({author: userId}).populate([{path: 'author'}, {path : 'comments', populate: {path: 'author'}
    }]);
        return posts; 
    }

    export async function getPostById(postId: string){
        const post : IPost = await Post.findOne({_id: postId}).populate([{path: 'author'}, {path : 'comments', populate: {path: 'author'}
    }]);
        return post; 
    }

    export async function createPost(data: DPost) {
        const iPost = new Post(data);
        let post = await iPost.save();
        return getPostById(post.id);
    }

    export async function updatePostById(postId: string, data: Partial<DPost>){
        const post = await Post.findByIdAndUpdate({_id : postId}, { $set: data}, {new : true}).populate([{path: 'author'}, {path : 'comments', populate: {path: 'author'}
        }]);
        return post;
    }

    export async function deletePostByid(postId: string){
        await Post.deleteOne({_id: postId});
        return "Post Deleted";
    }

    export async function deletePostsByids(postsIds: string[]){
        await Post.deleteMany({_id: { $in : postsIds} });
        return "Post Deleted";
    }

    export async function getPostByCommentId(commentId: any){
        const post = await Post.findOne({comments : {$in : [commentId]}});
        return post;
    }
}