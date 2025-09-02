/* eslint-disable @typescript-eslint/no-explicit-any */

export type Type<T = any> = new (...args: any[]) => T

export type InterRouterInpuuts<TServices extends Record<string, any>> = {
  [TService in keyof TServices]: {
    [TMehod in keyof TServices[TService]]: Parameters<
      TServices[TService][TMehod]
    >
  }
}

export type InferRouterOutputs<TControllers extends Record<string, any>> = {
  [TController in keyof TControllers]: {
    [TMehod in keyof TControllers[TController]]: ReturnType<
      TControllers[TController][TMehod]
    > extends Promise<infer U>
      ? U
      : ReturnType<TControllers[TController][TMehod]>
  }
}
