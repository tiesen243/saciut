import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

function mergeHeaders(init?: RequestInit): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (!init?.headers) return baseHeaders

  let customHeaders: Record<string, string> = {}
  if (init.headers instanceof Headers) {
    customHeaders = Object.fromEntries(init.headers.entries())
  } else if (Array.isArray(init.headers)) {
    customHeaders = Object.fromEntries(init.headers)
  } else {
    customHeaders = { ...init.headers }
  }
  return { ...baseHeaders, ...customHeaders }
}

export const api = {
  get: async <T>(url: string, init?: RequestInit) =>
    api.fetch<T>(url, { ...init, method: 'GET' }),
  post: async <T>(url: string, body: unknown, init?: RequestInit) =>
    api.fetch<T>(url, { ...init, method: 'POST', body: JSON.stringify(body) }),
  put: async <T>(url: string, body: unknown, init?: RequestInit) =>
    api.fetch<T>(url, { ...init, method: 'PUT', body: JSON.stringify(body) }),
  delete: async <T>(url: string, body?: unknown, init?: RequestInit) =>
    api.fetch<T>(url, {
      ...init,
      method: 'DELETE',
      body: JSON.stringify(body),
    }),

  fetch: async <T>(input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, {
      ...init,
      headers: mergeHeaders(init),
    })
    const contentType = response.headers.get('content-type') ?? ''
    let data: unknown
    if (contentType.includes('application/json')) data = await response.json()
    else data = await response.text()

    if (!response.ok) {
      const message =
        typeof data === 'object' && data && 'message' in data
          ? (data as { message?: string }).message
          : response.statusText
      throw new Error(message)
    }
    return data as T
  },
}

export type QueryOptions<TData> = Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
>
export type MutationOptions<TVars, TData> = Omit<
  UseMutationOptions<TData, Error, TVars>,
  'mutationKey' | 'mutationFn'
>
