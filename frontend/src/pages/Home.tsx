import { api } from "@/api";
import { BlogCard } from "@/components/app/BlogCard";
import { BlogType } from "@/types";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SkeletonBlogCard } from "@/components/skeleton/SkeletonBlogCard";
import { useDebounceCallback } from "usehooks-ts";
import { Input } from "@/components/ui/input";

function Home() {
  const [originalBlogs, setOriginalBlogs] = useState<BlogType[]>([]);
  const [searchResults, setSearchResults] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounced = useDebounceCallback(setSearchQuery, 300);

  async function getBlogs() {
    try {
      setIsLoading(true);
      const response = await api.get("/posts");
      setOriginalBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      async function searchBlogs() {
        try {
          setIsLoading(true);
          const response = await api.get(
            `/posts/searchBlog?query=${searchQuery}`,
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error searching blogs:", error);
        } finally {
          setIsLoading(false);
        }
      }
      searchBlogs();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const filteredBlogs = useMemo(() => {
    if (searchQuery) {
      return searchResults.length > 0 ? searchResults : [];
    }
    return originalBlogs;
  }, [searchQuery, searchResults, originalBlogs]);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Daily Blogs</h2>
      <div className="w-full max-w-2xl my-6">
        <Input
          type="text"
          placeholder="Search blogs..."
          onChange={(e) => debounced(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <SkeletonBlogCard key={index} />)
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog._id}`}>
              <BlogCard {...blog} />
            </Link>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </>
  );
}

export default Home;
