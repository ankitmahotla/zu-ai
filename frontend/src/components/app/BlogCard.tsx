import { BlogType } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { format, parseISO } from 'date-fns'

export function BlogCard({ title, content, createdAt }: BlogType) {
  const date = parseISO(createdAt.toString())

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Published {format(date, 'MMMM d, yyyy')}
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