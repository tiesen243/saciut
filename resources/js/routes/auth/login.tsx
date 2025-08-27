import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import type { Outputs } from '@/types'
import { SignInSchema } from '@/app/auth/auth.schema'
import { Button } from '@client/components/ui/button'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card'
import { useForm } from '@client/components/ui/form'
import { Input } from '@client/components/ui/input'
import { api } from '@client/lib/api'

export function Component() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validator: SignInSchema,
    onSubmit: (values) =>
      api.post<Outputs['auth']['signIn']>('/api/auth/sign-in', values),
    onSuccess: () => navigate('/'),
    onError: (error) => void toast.error(error.message),
  })

  return (
    <>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your details below to sign in to your account
        </CardDescription>
      </CardHeader>
      <form
        className="grid gap-4 px-6"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {fields.map((f) => (
          <form.Field
            key={f.name}
            name={f.name}
            render={({ field, meta }) => (
              <div id={meta.id} className="grid gap-2">
                <form.Label>{f.label}</form.Label>
                <form.Control {...field}>
                  <Input {...f} disabled={form.state.isPending} />
                </form.Control>
                <form.Message />
              </div>
            )}
          />
        ))}

        <Button type="submit" disabled={form.state.isPending}>
          Sign In
        </Button>
      </form>
    </>
  )
}

const fields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'example@gmail.com',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Your password',
  },
] as const
