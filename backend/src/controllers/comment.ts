import { Request, Response } from "express";
import { Post } from "../models/post";
import { Comment } from "../models/comment";
import { CreateCommentInput, UpdateCommentInput } from "@ankitmahotla/zu-ai_common";

export async function getComments(req: Request, res: Response) {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({ message: "No valid postId provided" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await Comment.find({ post: postId }).populate('author', 'username');

        res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createComment(req: Request, res: Response) {
    try {
        const result = CreateCommentInput.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
        }

        const { postId, content, parentComment } = result.data;
        const author = req.user?._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = new Comment({
            content,
            author,
            post: postId,
            parentComment: parentComment || null
        });

        await newComment.save();
        res.status(201).json({ message: "Comment created successfully", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function updateComment(req: Request, res: Response) {
    try {
        const result = UpdateCommentInput.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
        }

        const { id } = req.params;
        const { content } = result.data;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!comment.author.equals(req.user?._id)) {
            return res.status(403).json({ message: "Unauthorized to update this comment" });
        }

        comment.content = content;
        comment.updatedAt = new Date();

        await comment.save();
        res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!comment.author.equals(req.user?._id)) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}