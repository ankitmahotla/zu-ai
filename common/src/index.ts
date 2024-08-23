import z from "zod";
import mongoose from "mongoose";

// Post schemas
export const CreatePostInput = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).optional()
});
export type CreatePostInputType = z.infer<typeof CreatePostInput>;

export const UpdatePostInput = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    tags: z.array(z.string()).optional()
});
export type UpdatePostInputType = z.infer<typeof UpdatePostInput>;

// Comment schemas
export const CreateCommentInput = z.object({
    postId: z.string().refine(mongoose.Types.ObjectId.isValid, "Invalid post ID"),
    content: z.string().min(1, "Content is required"),
    parentComment: z.string().refine(mongoose.Types.ObjectId.isValid, "Invalid parent comment ID").optional()
});
export type CreateCommentInputType = z.infer<typeof CreateCommentInput>;

export const UpdateCommentInput = z.object({
    content: z.string().min(1, "Content is required")
});
export type UpdateCommentInputType = z.infer<typeof UpdateCommentInput>;

// User schemas
export const RegisterUserInput = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});
export type RegisterUserInputType = z.infer<typeof RegisterUserInput>;

export const LoginUserInput = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});
export type LoginUserInputType = z.infer<typeof LoginUserInput>;

export const RefreshTokenInput = z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
});
export type RefreshTokenInputType = z.infer<typeof RefreshTokenInput>;