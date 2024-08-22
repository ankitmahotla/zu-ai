import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface BlogCardProps {
  title: string;
  content: string;
  publishDate: string;
  readTime: string;
}

export function BlogCard({ title, content, publishDate, readTime }: BlogCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Published {publishDate} • {readTime} read
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {content.length > 150 ? `${content.slice(0, 150)}...` : content}
        </p>
      </CardContent>
    </Card>
  )
}