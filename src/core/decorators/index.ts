import 'reflect-metadata'

import type { ModuleMetadata, Type } from '@/core/decorators/types'

const CONTROLLERS_METADATA_KEY = Symbol('controllers')
const PROVIDERS_METADATA_KEY = Symbol('providers')
const CONTROLLER_PREFIX_METADATA_KEY = Symbol('controller:prefix')
const INJECTABLE_METADATA_KEY = Symbol('injectable')

export function Module(metadata: ModuleMetadata): ClassDecorator {
  let controllers = metadata.controllers
  let providers = metadata.providers

  return (target) => {
    if (metadata.imports) {
      for (const Module of metadata.imports) {
        const importedControllers = Reflect.getMetadata(
          CONTROLLERS_METADATA_KEY,
          Module,
        ) as Type[]
        const importedProviders = Reflect.getMetadata(
          PROVIDERS_METADATA_KEY,
          Module,
        ) as Type[]
        controllers = [...controllers, ...importedControllers]
        providers = [...providers, ...importedProviders]
      }
    }

    Reflect.defineMetadata(CONTROLLERS_METADATA_KEY, controllers, target)
    Reflect.defineMetadata(PROVIDERS_METADATA_KEY, providers, target)
  }
}

export function getControllers(target: Type): Type[] {
  return Reflect.getMetadata(CONTROLLERS_METADATA_KEY, target) as Type[]
}

export function getProviders(target: Type): Type[] {
  return Reflect.getMetadata(PROVIDERS_METADATA_KEY, target) as Type[]
}

export function Controller(prefix?: string): ClassDecorator {
  const path = prefix ?? '/'
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_PREFIX_METADATA_KEY, path, target)
  }
}

export function getControllerPrefix(target: Type): string {
  return String(
    Reflect.getMetadata(CONTROLLER_PREFIX_METADATA_KEY, target) ?? '/',
  )
}

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
  }
}

export function isInjectable(target: Type): boolean {
  return !!Reflect.getMetadata(INJECTABLE_METADATA_KEY, target)
}

export * from './method'
