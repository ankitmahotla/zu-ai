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
  refetchBlog?: () => Promise<void>;
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
    try {
      setIsSaving(true);
      const response = await api.put(`posts/${id}`, values);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
      form.reset();
      setUpdateBlogOpen(false);
      refetchBlog();
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
