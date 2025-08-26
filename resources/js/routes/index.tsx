import { useQuery } from '@tanstack/react-query'

import type { PostType } from '@/app/post/post.schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card'

export default function Index() {
  const { data: health, status: healthStatus } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('/api/health')
      if (!response.ok) throw new Error('Network response was not ok')
      return (await response.json()) as { status: string; database: string }
    },
  })

  const { data: posts, status: postsStatus } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Network response was not ok')
      return (await response.json()) as { data: PostType[] }
    },
  })

  return (
    <main className="container py-4">
      <pre className="mx-auto w-1/2 rounded-md bg-secondary p-4 text-secondary-foreground">
        {healthStatus === 'success'
          ? JSON.stringify(health, null, 2)
          : JSON.stringify(
              { status: healthStatus, database: 'Loading...' },
              null,
              2,
            )}
      </pre>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {postsStatus === 'success' ? (
          posts.data.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.createdAt).toISOString()}
                </CardDescription>
              </CardHeader>
              <CardContent>{post.content}</CardContent>
            </Card>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </main>
  )
}
