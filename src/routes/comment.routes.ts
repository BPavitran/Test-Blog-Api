import { Express } from "express";
import { CommentEp } from "../endpoints/comment.ep";

export function initCommentRoutes(app: Express) {
    app.get('/api/comments-by-post-id/:postId', CommentEp.getCommentsByPostId);

    app.post('/api/create-comment', CommentEp.createComment);
    app.post('/api/update-comment', CommentEp.updateComment);
    app.post('/api/delete-comment', CommentEp.deleteCommentById);
}