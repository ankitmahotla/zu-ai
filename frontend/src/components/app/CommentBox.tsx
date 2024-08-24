import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CreateCommentInput } from "@ankitmahotla/zu-ai_common"
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CommentBoxProps {
    postId: string;
    handleCommentSubmit: (content: string) => void;
}

export function CommentBox({ postId, handleCommentSubmit }: CommentBoxProps) {
    const { isAuthenticated } = useAuthStore()
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof CreateCommentInput>>({
        resolver: zodResolver(CreateCommentInput),
        defaultValues: {
            postId: postId,
            content: "",
        },
    })

    function onSubmit(values: z.infer<typeof CreateCommentInput>) {
        if (!isAuthenticated) {
            toast.error("Please log in to post a comment");
            navigate("/login");
            return;
        }
        else {
            console.log("CommentBox onSubmit called with:", values);
            handleCommentSubmit(values.content)
            form.reset()
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your comment"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}