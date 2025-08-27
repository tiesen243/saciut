import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import type { Outputs } from '@/types'
import { StorePostSchema } from '@/app/post/post.schema'
import { postFilters, postOptions } from '@client/api/post'
import { Button } from '@client/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card'
import { useForm } from '@client/components/ui/form'
import { Input } from '@client/components/ui/input'
import { Textarea } from '@client/components/ui/textarea'

export default function Index() {
  return (
    <main className="container py-4">
      <CreatePost />
      <PostList />
    </main>
  )
}

function CreatePost() {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation(
    postOptions.store({
      onSuccess: () => queryClient.invalidateQueries(postFilters.all()),
      onError: (e) => toast.error(e.message),
    }),
  )

  const form = useForm({
    defaultValues: { id: '' as string | undefined, title: '', content: '' },
    validator: StorePostSchema,
    onSubmit: mutateAsync,
    onSuccess: () => {
      form.reset()
    },
  })

  return (
    <form
      className="mt-8 grid gap-4 rounded-md border bg-card p-6 text-card-foreground shadow-sm"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="title"
        render={({ field, meta }) => (
          <div id={meta.id} className="grid gap-2">
            <form.Label>Title</form.Label>
            <form.Control {...field}>
              <Input placeholder="What's on your mind?" />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name="content"
        render={({ field, meta }) => (
          <div id={meta.id} className="grid gap-2">
            <form.Label>Content</form.Label>
            <form.Control {...field}>
              <Textarea placeholder="Write something..." />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>Create Post</Button>
    </form>
  )
}

function PostList() {
  const { data, status } = useQuery(postOptions.all())

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {status === 'success'
        ? data.data.map((post) => <PostCard key={post.id} post={post} />)
        : Array.from({ length: 3 }, (_, index) => (
            <PostCardSkeleton key={index} />
          ))}
    </div>
  )
}

function PostCard({
  post,
}: Readonly<{ post: Outputs['post']['findMany']['data'][number] }>) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation(
    postOptions.delete({
      onSuccess: () => queryClient.invalidateQueries(postFilters.all()),
      onError: (e) => toast.error(e.message),
    }),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          {new Date(post.createdAt).toISOString()}
        </CardDescription>

        <CardAction>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              mutate(post.id)
            }}
            disabled={isPending}
          >
            <Trash2Icon />
            <span className="sr-only">Delete Post</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
    </Card>
  )
}

function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="w-1/2 animate-pulse rounded-md bg-current">
          &nbsp;
        </CardTitle>
        <CardDescription className="w-1/3 animate-pulse rounded-md bg-current">
          &nbsp;
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-full animate-pulse rounded-md bg-current" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded-md bg-current" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded-md bg-current" />
      </CardContent>
    </Card>
  )
}
