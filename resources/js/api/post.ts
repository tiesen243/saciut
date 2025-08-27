import { mutationOptions, queryOptions } from '@tanstack/react-query'

import type { Inputs, Outputs } from '@/types'
import type { MutationOptions, QueryOptions } from '@client/lib/api'
import { api } from '@client/lib/api'

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
      queryFn: () => api.get<TData>('/api/posts'),
    }),

  byId: <TData extends Outputs['post']['findOne']>(
    id: string,
    options: QueryOptions<TData> = {},
  ) =>
    queryOptions({
      ...options,
      ...postFilters.byId(id),
      queryFn: () => api.get<TData>(`/api/posts/${id}`),
      enabled: !!id,
    }),

  store: <TData extends Outputs['post']['store']>(
    options: MutationOptions<Inputs['post']['store'], TData> = {},
  ) =>
    mutationOptions({
      ...options,
      ...postFilters.store(),
      mutationFn: async (post: Inputs['post']['store']) =>
        api.post<TData>('/api/posts', post),
    }),

  delete: <TData extends Outputs['post']['deleteOne']>(
    options: MutationOptions<string, TData> = {},
  ) =>
    mutationOptions({
      ...options,
      ...postFilters.delete(),
      mutationFn: async (id: string) => api.delete<TData>(`/api/posts/${id}`),
    }),
} as const
