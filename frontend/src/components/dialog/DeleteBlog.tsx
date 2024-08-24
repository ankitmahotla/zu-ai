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

function DeleteBlog({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  async function handleConfirm() {
    try {
      setIsDeleting(true);
      const response = await api.delete(`posts/${id}`);
      navigate("/");
      console.log(response.data);
    } catch (error) {
      console.log(error);
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
