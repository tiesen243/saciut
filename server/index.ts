// NOTE: This approach works even better when used in a monorepo setup,
// as types can be shared seamlessly across backend and frontend packages.

import type { InferRouterOutputs, InterRouterInpuuts } from '@/core/types'

import type { AppController } from '@/modules/app.controller'

interface Controllers {
  app: AppController
}

export type RouterInputs = InterRouterInpuuts<Controllers>
export type RouterOutputs = InferRouterOutputs<Controllers>
