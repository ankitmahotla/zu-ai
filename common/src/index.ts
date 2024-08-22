import z from "zod";

export const CreateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    author: z.string(),
    tags: z.array(z.string()).optional()
})
export type CreateBlogInputType = z.infer<typeof CreateBlogInput>

export const UpdateBlogInput = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional()
})
export type UpdateBlogInputType = z.infer<typeof UpdateBlogInput>

