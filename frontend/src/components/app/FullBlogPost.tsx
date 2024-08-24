import { BlogType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format, parseISO } from "date-fns";
import { Edit, Trash } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { UpdateBlog } from "../dialog/UpdateBlog";
import { useState } from "react";
import DeleteBlog from "../dialog/DeleteBlog";

interface FullBlogPostType extends BlogType {
  refetchBlog: () => Promise<void>;
}

export function FullBlogPost({
  _id,
  title,
  content,
  createdAt,
  author,
  refetchBlog,
}: FullBlogPostType) {
  const date = parseISO(createdAt.toString());
  const { user } = useAuthStore();
  const [updateBlogOpen, setUpdateBlogOpen] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between item-center text-2xl md:text-3xl">
          {title}{" "}
          {user?._id === author && (
            <div className="flex items-center gap-2">
              <Dialog open={updateBlogOpen} onOpenChange={setUpdateBlogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <Edit size={20} />
                  </Button>
                </DialogTrigger>
                <UpdateBlog
                  id={_id}
                  title={title}
                  content={content}
                  setUpdateBlogOpen={setUpdateBlogOpen}
                  refetchBlog={refetchBlog}
                />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <Trash size={20} />
                  </Button>
                </DialogTrigger>
                <DeleteBlog id={_id} />
              </Dialog>
            </div>
          )}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Published {format(date, "MMMM d, yyyy")}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm sm:prose lg:prose-lg">
          {content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
