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
import { toast } from "sonner";
import { AxiosError } from "axios";

function DeleteComment({
  id,
  refetchComments,
}: {
  id: string;
  refetchComments: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await api.delete(`comments/${id}`);
      toast.success("Comment deleted successfully");
      refetchComments();
    } catch (error) {
      let errorMessage = "Failed to delete comment. Please try again.";
  
      if (error instanceof AxiosError && error.response?.data) {
        const { message } = error.response.data;
        if (message.includes("not found")) {
          errorMessage = "Comment not found. It may have already been deleted.";
        } else if (message.includes("not authorized")) {
          errorMessage = "You are not authorized to delete this comment.";
        } else {
          errorMessage = message || errorMessage;
        }
      }
  
      toast.error(errorMessage);
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          comment.
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

export default DeleteComment;
