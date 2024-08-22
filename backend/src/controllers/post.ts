import { Request, Response } from "express";
import { Post } from "../models/post";
import { CreateBlogInput, UpdateBlogInput } from "@ankitmahotla/zu-ai_common";

async function getBlogs(req: Request, res: Response) {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error });
    }
}

async function getBlog(req: Request, res: Response) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
}

async function createPost(req: Request, res: Response) {
    try {
        const { success } = CreateBlogInput.safeParse(req.body)
        if (!success) {
            return res.status(401).json({ message: "Invalid/missing inputs" })
        }
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: 'Error creating Blog', error });
    }
}

async function updatePost(req: Request, res: Response) {
    try {
        const { success } = UpdateBlogInput.safeParse(req.body)
        if (!success) {
            return res.status(401).json({ message: "Invalid/missing inputs" })
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: 'Error updating post', error });
    }
}

async function deletePost(req: Request, res: Response) {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
}

export { getBlog, getBlogs, createPost, updatePost, deletePost }