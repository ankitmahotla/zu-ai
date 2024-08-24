import { Request, Response } from "express";
import { Post } from "../models/post";
import mongoose from "mongoose";
import { CreatePostInput, UpdatePostInput } from "@ankitmahotla/zu-ai_common";

export async function getBlogs(req: Request, res: Response) {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
}

export async function getBlog(req: Request, res: Response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const result = CreatePostInput.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: result.error.errors });
    }

    const newPost = new Post({
      ...result.data,
      author: req.user?._id,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating Blog", error });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const result = UpdatePostInput.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: result.error.errors });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      result.data,
      { new: true },
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
}

export async function getBlogByTitleOrContent(req: Request, res: Response) {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found matching the criteria" });
    }

    res.json(posts);
  } catch (error) {
    console.error("Error in getBlogByTitleOrContent:", error);
    res.status(500).json({ message: "Error fetching posts", error: error });
  }
}
