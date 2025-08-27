import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { Inputs, Outputs } from '@/types'
import type { MutationOptions, QueryOptions } from '@client/lib/fetch-json'
import { fetchJson } from '@client/lib/fetch-json'

export const postFilters = {
  all: () => ({ queryKey: ['posts'] }),
  byId: (id: string) => ({ queryKey: ['posts', id] }),
  store: () => ({ mutationKey: ['posts', 'store'] }),
  delete: () => ({ mutationKey: ['posts', 'delete'] }),
} as const

export const postOptions = {
  all: <TData extends Outputs['post']['findMany']>(
    options: QueryOptions<TData> = {},
  ) =>
    queryOptions({
      ...options,
      ...postFilters.all(),
      queryFn: () => fetchJson<TData>('/api/posts'),
    }),

  byId: <TData extends Outputs['post']['findOne']>(
    id: string,
    options: QueryOptions<TData> = {},
  ) =>
    queryOptions({
      ...options,
      ...postFilters.byId(id),
      queryFn: () => fetchJson<TData>(`/api/posts/${id}`),
      enabled: !!id,
    }),

  store: <TData extends Outputs['post']['store']>(
    options: MutationOptions<Inputs['post']['store'], TData> = {},
  ) =>
    mutationOptions({
      ...options,
      ...postFilters.store(),
      mutationFn: async (post: Inputs['post']['store']) =>
        fetchJson<TData>('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        }),
    }),

  delete: <TData extends Outputs['post']['deleteOne']>(
    options: MutationOptions<string, TData> = {},
  ) =>
    mutationOptions({
      ...options,
      ...postFilters.delete(),
      mutationFn: async (id: string) =>
        fetchJson<TData>(`/api/posts/${id}`, {
          method: 'DELETE',
        }),
    }),
} as const
