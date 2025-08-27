import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { PostType, StorePostType } from '@/app/post/post.schema'

type QueryOptions<TData> = Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
type MutationOptions<TVars, TData> = Omit<
  UseMutationOptions<TData, Error, TVars>,
  'mutationKey' | 'mutationFn'
>

export const postFilters = {
  all: () => ({ queryKey: ['posts'] }),
  byId: (id: string) => ({ queryKey: [...postFilters.all().queryKey, id] }),
  store: () => ({ mutationKey: [...postFilters.all().queryKey, 'store'] }),
  delete: () => ({ mutationKey: [...postFilters.all().queryKey, 'delete'] }),
} as const

export const postOptions = {
  all: (options: QueryOptions<{ data: PostType[] }> = {}) =>
    queryOptions({
      ...options,
      ...postFilters.all(),
      queryFn: async () => {
        const response = await fetch('/api/posts')
        if (!response.ok) throw new Error('Network response was not ok')
        return (await response.json()) as { data: PostType[] }
      },
    }),

  byId: (id: string, options: QueryOptions<{ data: PostType }> = {}) =>
    queryOptions({
      ...options,
      ...postFilters.byId(id),
      queryFn: async () => {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) throw new Error('Network response was not ok')
        return (await response.json()) as { data: PostType }
      },
      enabled: !!id,
    }),

  store: (options: MutationOptions<StorePostType, { data: PostType }> = {}) =>
    mutationOptions({
      ...options,
      ...postFilters.store(),
      mutationFn: async (post: StorePostType) => {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        })
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json() as Promise<{ data: PostType }>
      },
    }),

  delete: (options: MutationOptions<string, { data: PostType }> = {}) =>
    mutationOptions({
      ...options,
      ...postFilters.delete(),
      mutationFn: async (id: string) => {
        const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json() as Promise<{ data: PostType }>
      },
    }),
} as const
