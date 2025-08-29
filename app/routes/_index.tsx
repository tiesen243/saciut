import { data } from 'react-router'

import type { Route } from './+types/_index'

export async function loader() {
  const res = await fetch('http://localhost:3000/api/health')
  return data((await res.json()) as { status: string; timestamp: string })
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <main className="container py-4">
      <pre className="bg-secondary text-secondary-foreground shadow-md border rounded-md p-4 overflow-x-auto">
        {JSON.stringify(loaderData, null, 2)}
      </pre>
    </main>
  )
}
