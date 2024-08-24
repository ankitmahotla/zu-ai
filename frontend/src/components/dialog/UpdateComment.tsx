import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateCommentInput } from "@ankitmahotla/zu-ai_common";
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
import { api } from "@/api";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
export function UpdateComment({
  id,
  content,
  refetchComments,
}: {
  id: string;
  content: string;
  refetchComments: () => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof UpdateCommentInput>>({
    resolver: zodResolver(UpdateCommentInput),
    defaultValues: {
      content,
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateCommentInput>) {
    setIsSaving(true);
    try {
      await api.put(`comments/${id}`, values);
      toast.success("Comment updated successfully");
      refetchComments();
    } catch (error) {
      let errorMessage = "Failed to update comment. Please try again.";
  
      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("not found")) {
          errorMessage = "Comment not found. It may have been deleted.";
        } else if (message.includes("not authorized")) {
          errorMessage = "You are not authorized to update this comment.";
        } else if (message.includes("content too short")) {
          errorMessage = "Comment content is too short. Please add more details.";
        } else {
          errorMessage = message || errorMessage;
        }
      }
  
      toast.error(errorMessage);
      console.error("Error updating comment:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogDescription>
          Make changes to your comment here.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose asChild>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving" : "Save"}
            </Button>
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  );
}
