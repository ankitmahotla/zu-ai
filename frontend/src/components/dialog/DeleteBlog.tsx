import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { api } from "@/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

function DeleteBlog({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await api.delete(`posts/${id}`);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      let errorMessage = "Failed to delete post. Please try again.";

      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("not found")) {
          errorMessage = "Post not found. It may have already been deleted.";
        } else if (message.includes("not authorized")) {
          errorMessage = "You are not authorized to delete this post.";
        } else {
          errorMessage = message || errorMessage;
        }
      }

      toast.error(errorMessage);
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your blog.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button
          variant="destructive"
          disabled={isDeleting}
          onClick={handleConfirm}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default DeleteBlog;
