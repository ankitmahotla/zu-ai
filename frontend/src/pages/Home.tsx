import { api } from "@/api";
import { BlogCard } from "@/components/app/BlogCard";
import { BlogType } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SkeletonBlogCard } from "@/components/skeleton/SkeletonBlogCard";

function Home() {
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function getBlogs() {
        try {
            setIsLoading(true);
            const response = await api.get("/posts");
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getBlogs();
    }, []);

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">Daily Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
                    Array(4).fill(0).map((_, index) => (
                        <SkeletonBlogCard key={index} />
                    ))
                ) : blogs.length > 0 ? (
                    blogs.map((blog) => (
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