import { useLoaderData } from 'react-router'

export function loader() {
  return {
    message: 'This is the about page.',
  }
}

export function Component() {
  const { message } = useLoaderData<typeof loader>()

  return (
    <main className="container py-4">
      <h1 className="mb-4 text-2xl font-bold">About Page</h1>
      <p>{message}</p>
    </main>
  )
}
