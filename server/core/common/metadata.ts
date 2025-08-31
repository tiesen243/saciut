import 'reflect-metadata'

import type { Type } from '@/core/types'

const CONTROLLERS_METADATA_KEY = Symbol('module:controllers')
const PROVIDERS_METADATA_KEY = Symbol('module:providers')
const CONTROLLER_METADATA_KEY = Symbol('metadata:controller')
const CONTROLLER_PREFIX_KEY = Symbol('metadata:controller:prefix')
const INJECTABLE_METADATA_KEY = Symbol('metadata:injectable')
const INJECT_METADATA_KEY = Symbol('metadata:inject')

export function Module(options: {
  imports: Type[]
  controllers: Type[]
  providers: (Type | { provide: string; useValue: unknown })[]
}): ClassDecorator {
  return (target) => {
    const importedControllers = options.imports.flatMap(getControllers)
    const importedProviders = options.imports.flatMap(getProviders)

    Reflect.defineMetadata(
      CONTROLLERS_METADATA_KEY,
      [...options.controllers, ...importedControllers],
      target,
    )
    Reflect.defineMetadata(
      PROVIDERS_METADATA_KEY,
      [...options.providers, ...importedProviders],
      target,
    )
  }
}

export function getControllers(target: Type): Type[] {
  return (Reflect.getMetadata(CONTROLLERS_METADATA_KEY, target) ?? []) as Type[]
}

export function getProviders(target: Type): Type[] {
  return (Reflect.getMetadata(PROVIDERS_METADATA_KEY, target) ?? []) as Type[]
}

export function Controller(prefix = '/'): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, true, target)
    Reflect.defineMetadata(CONTROLLER_PREFIX_KEY, prefix, target)
  }
}

export function isController(target: Type): boolean {
  return !!Reflect.getMetadata(CONTROLLER_METADATA_KEY, target)
}

export function getControllerPrefix(target: Type): string {
  return String(Reflect.getMetadata(CONTROLLER_PREFIX_KEY, target))
}

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
  }
}

export function isInjectable(target: Type): boolean {
  return !!Reflect.getMetadata(INJECTABLE_METADATA_KEY, target)
}

export function Inject(token: string): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existingInjectedParams = (Reflect.getOwnMetadata(
      INJECT_METADATA_KEY,
      target,
    ) ?? {}) as Record<number, string>
    existingInjectedParams[parameterIndex] = token
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingInjectedParams, target)
  }
}

export function isInject(target: object): boolean {
  return 'provide' in target && 'useValue' in target
}

export function getInjectedParams(target: object): Record<number, string> {
  return (Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) ?? {}) as Record<
    number,
    string
  >
}
