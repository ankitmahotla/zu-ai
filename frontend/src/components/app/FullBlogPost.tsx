import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface FullBlogPostProps {
  title: string;
  content: string;
  publishDate: string;
  readTime: string;
}

export function FullBlogPost({ title, content, publishDate, readTime }: FullBlogPostProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Published {publishDate} • {readTime} read
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm sm:prose lg:prose-lg">
          {content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}