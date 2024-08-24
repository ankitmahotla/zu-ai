import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdatePostInput } from "@ankitmahotla/zu-ai_common";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { api } from "@/api";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
export function UpdateBlog({
  id,
  title,
  content,
  setUpdateBlogOpen,
  refetchBlog,
}: {
  id: string;
  title: string;
  content: string;
  setUpdateBlogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchBlog: () => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof UpdatePostInput>>({
    resolver: zodResolver(UpdatePostInput),
    defaultValues: {
      title,
      content,
    },
  });

  async function onSubmit(values: z.infer<typeof UpdatePostInput>) {
    setIsSaving(true);
    try {
      await api.put(`posts/${id}`, values);
      toast.success("Post updated successfully");
      setUpdateBlogOpen(false);
      refetchBlog();
    } catch (error) {
      let errorMessage = "Failed to update post. Please try again.";
  
      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("not found")) {
          errorMessage = "Post not found. It may have been deleted.";
        } else if (message.includes("not authorized")) {
          errorMessage = "You are not authorized to update this post.";
        } else if (message.includes("title already exists")) {
          errorMessage = "A post with this title already exists. Please choose a different title.";
        } else {
          errorMessage = message || errorMessage;
        }
      }
  
      toast.error(errorMessage);
      console.error("Error updating post:", error);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Blog Post</DialogTitle>
        <DialogDescription>Make changes to your blog here.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving" : "Save"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
