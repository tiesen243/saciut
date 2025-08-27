'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import type { User } from '@/app/auth/lib/types'
import type { Outputs } from '@/types'
import { api } from '@client/lib/api'

type SessionContextValue = {
  signOut: () => Promise<void>
} & (
  | { status: 'pending'; user: User | null }
  | { status: 'error'; user: null }
  | { status: 'success'; user: User }
)

const SessionContext = React.createContext<SessionContextValue | null>(null)

function useSession() {
  const context = React.use(SessionContext)
  if (!context)
    throw new Error('useSession must be used within a SessionProvider')
  return context
}

function SessionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const navigate = useNavigate()

  const { data, status, refetch } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () =>
      api.get<Outputs['auth']['getUser']>('/api/auth/get-session'),
    retry: false,
  })

  const signOut = React.useCallback(async () => {
    await api.post('/api/auth/sign-out', {})
    await navigate('/')
    await refetch()
  }, [])

  const value = React.useMemo(
    () => ({ status, user: data?.data, signOut }),
    [status, data?.data],
  ) as SessionContextValue

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
