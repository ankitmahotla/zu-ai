import { useState, useCallback } from "react";
import { api } from "@/api";
import { BlogType, CommentType } from "@/types";

function useBlogAndComments(postId: string) {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlog(null);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments?postId=${postId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  }, [postId]);

  const fetchBlogAndComments = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchBlog(), fetchComments()]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBlog, fetchComments]);

  return {
    blog,
    comments,
    isLoading,
    refetchBlog: fetchBlog,
    refetchComments: fetchComments,
    refetchAll: fetchBlogAndComments,
  };
}

export default useBlogAndComments;
