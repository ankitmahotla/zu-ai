import { FullBlogPost } from "@/components/app/FullBlogPost";
import { sampleBlogData } from "@/data";

function Blog() {
    return (
        <FullBlogPost {...sampleBlogData[0]} />
    )
}

export default Blog;