import 'reflect-metadata'

import type { ZodType } from 'zod'
import { flattenError } from 'zod'

import { HttpException } from '@/core/common'

const PARAMETTERS_KEY = Symbol('parameters')

export enum ParamType {
  REQ = 'req',
  RES = 'res',
  NEXT = 'next',

  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',

  HEADERS = 'headers',
  COOKIES = 'cookies',
}

interface ParamValue {
  index: number
  type: ParamType
  schema: ZodType | undefined
}

function createParamDecorator(
  type: ParamType,
  schema?: ZodType,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existingParams = (Reflect.getOwnMetadata(
      PARAMETTERS_KEY,
      target,
      propertyKey ?? '',
    ) ?? []) as ParamValue[]
    existingParams.push({ index: parameterIndex, type, schema })
    Reflect.defineMetadata(
      PARAMETTERS_KEY,
      existingParams,
      target,
      String(propertyKey),
    )
  }
}

export function getParams<
  T extends { index: number; type: ParamType; schema?: ZodType },
>(target: object, propertyKey: string | symbol): T[] {
  return (Reflect.getOwnMetadata(PARAMETTERS_KEY, target, propertyKey) ??
    []) as T[]
}

export function parsedSchema(schema: ZodType, data: unknown) {
  const parsed = schema.safeParse(data)
  if (!parsed.success)
    throw new HttpException('BAD_REQUEST', {
      message: 'Invalid request data',
      details: flattenError(parsed.error).fieldErrors,
    })

  return parsed.data
}

export const Req = (): ParameterDecorator => createParamDecorator(ParamType.REQ)
export const Res = (): ParameterDecorator => createParamDecorator(ParamType.RES)
export const Next = (): ParameterDecorator =>
  createParamDecorator(ParamType.NEXT)

export const Body = (schema?: ZodType): ParameterDecorator =>
  createParamDecorator(ParamType.BODY, schema)
export const Query = (schema?: ZodType): ParameterDecorator =>
  createParamDecorator(ParamType.QUERY, schema)
export const Params = (schema?: ZodType): ParameterDecorator =>
  createParamDecorator(ParamType.PARAMS, schema)
export const Headers = (schema?: ZodType): ParameterDecorator =>
  createParamDecorator(ParamType.HEADERS, schema)
export const Cookies = (schema?: ZodType): ParameterDecorator =>
  createParamDecorator(ParamType.COOKIES, schema)
