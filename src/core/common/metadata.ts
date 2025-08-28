import 'reflect-metadata'

const CONTROLLERS_METADATA_KEY = Symbol('module:controllers')
const PROVIDERS_METADATA_KEY = Symbol('module:providers')
const CONTROLLER_METADATA_KEY = Symbol('metadata:controller')
const CONTROLLER_PREFIX_KEY = Symbol('metadata:controller:prefix')
const INJECTABLE_METADATA_KEY = Symbol('metadata:injectable')

export function Module(options: {
  imports: Type[]
  controllers: Type[]
  providers: Type[]
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
