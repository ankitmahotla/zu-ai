import z from "zod";

export const CreateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    author: z.string(),
    tags: z.array(z.string())
})
export type CreateBlogInputType = z.infer<typeof CreateBlogInput>

export const UpdateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    author: z.string(),
    tags: z.array(z.string())
})
export type UpdateBlogInputType = z.infer<typeof UpdateBlogInput>

