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

function DeleteComment({
  id,
  refetchComments,
}: {
  id: string;
  refetchComments: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    try {
      setIsDeleting(true);
      const response = await api.delete(`comments/${id}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      refetchComments();
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
