import { CommentBox } from "@/components/app/CommentBox";
import { FullBlogPost } from "@/components/app/FullBlogPost";
import useAuthStore from "@/store/useAuthStore";
import { api } from "@/api";
import { Edit, Loader2, Trash } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useBlogAndComments from "@/hooks/useBlogsAndComments";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UpdateComment } from "@/components/dialog/UpdateComment";
import DeleteComment from "@/components/dialog/DeleteComment";
import { toast } from "sonner";
import { AxiosError } from "axios";

function Blog() {
  const location = useLocation();
  const { user } = useAuthStore();
  const postId = location.pathname.split("/")[2];

  const {
    blog,
    comments,
    isLoading,
    refetchComments,
    refetchAll,
    refetchBlog,
  } = useBlogAndComments(postId);

  useEffect(() => {
    refetchAll();
  }, [postId]);

  const handleCommentSubmit = async (content: string) => {
    try {
      await api.post("/comments", { postId, content });
      toast.success("Comment posted successfully");
      refetchComments();
    } catch (error) {
      let errorMessage = "Failed to post comment. Please try again.";

      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("content too short")) {
          errorMessage = "Comment is too short. Please add more details.";
        } else if (message.includes("not authorized")) {
          errorMessage = "You are not authorized to post comments.";
        } else {
          errorMessage = message || errorMessage;
        }
      }

      toast.error(errorMessage);
      console.error("Error posting comment:", error);
    }
  };

  if (isLoading) {
    return <Loader2 className="mx-auto animate-spin" />
  }

  if (!blog) {
    return <p className="text-center text-lg">Blog post not found.</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <FullBlogPost {...blog} refetchBlog={refetchBlog} />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="max-h-40 overflow-y-scroll mb-10">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white p-4 rounded-lg mb-4 border-b-2 border-b-slate-200"
            >
              <div className="flex justify-between items-center">
                <p>{comment.content}</p>
                {user?.username === comment.author.username && (
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Edit size={20} />
                        </Button>
                      </DialogTrigger>
                      <UpdateComment
                        content={comment.content}
                        id={comment._id}
                        refetchComments={refetchComments}
                      />
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Trash size={20} />
                        </Button>
                      </DialogTrigger>
                      <DeleteComment
                        id={comment._id}
                        refetchComments={refetchComments}
                      />
                    </Dialog>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                By {comment.author.username} on{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <CommentBox handleCommentSubmit={handleCommentSubmit} postId={postId} />
      </div>
    </div>
  );
}

export default Blog;
