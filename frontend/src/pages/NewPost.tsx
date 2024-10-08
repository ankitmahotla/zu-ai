import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreatePostInput } from "@ankitmahotla/zu-ai_common";
import { api } from "@/api";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function NewPost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof CreatePostInput>>({
    resolver: zodResolver(CreatePostInput),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreatePostInput>) {
    setIsSubmitting(true);
    try {
      const response = await api.post("posts", values);
      toast.success("Post created successfully!");
      navigate(`/blog/${response.data._id}`);
    } catch (error) {
      let errorMessage = "Failed to create post. Please try again.";

      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("content too short")) {
          errorMessage = "Post content is too short. Please add more details.";
        } else {
          errorMessage = message || errorMessage;
        }
      }

      toast.error(errorMessage);
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your blog title" {...field} />
                </FormControl>
                <FormDescription>
                  Give your blog post a catchy title.
                </FormDescription>
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
                  <Textarea
                    placeholder="Write your blog content here"
                    {...field}
                    rows={10}
                  />
                </FormControl>
                <FormDescription>
                  Write the main content of your blog post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
