import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
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
    try {
      setIsSaving(true);
      const response = await api.put(`comments/${id}`, values);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
      refetchComments();
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
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
