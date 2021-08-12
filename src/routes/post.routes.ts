import { Express } from "express";
import { PostEp } from "../endpoints/post.ep";

export function initPostRoutes(app: Express) {
    app.get('/api/posts', PostEp.getAllPosts);
    app.get('/api/posts-by-user-id/:userId', PostEp.getPostsByUserId);

    app.post('/api/create-post', PostEp.createPost);
    app.post('/api/update-post', PostEp.updatePost);
    app.post('/api/delete-post', PostEp.deletePostById);
}