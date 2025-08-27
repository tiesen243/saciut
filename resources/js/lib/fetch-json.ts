import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init)
  const json = (await response.json()) as T
  if (!response.ok)
    throw new Error(
      (json as { message?: string }).message ?? 'An error occurred',
    )
  return json
}

export type QueryOptions<TData> = Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
>
export type MutationOptions<TVars, TData> = Omit<
  UseMutationOptions<TData, Error, TVars>,
  'mutationKey' | 'mutationFn'
>
