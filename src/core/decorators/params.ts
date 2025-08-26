import * as z from 'zod'

import { HttpError } from '@/common/utils/http'

const PARAMS_METADATA_KEY = Symbol('params')

export enum ParamType {
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'param',

  COOKIES = 'cookies',
  HEADERS = 'headers',

  REQUEST = 'request',
  RESPONSE = 'response',
  NEXT = 'next',
}

export interface ParamDefinition {
  index: number
  type: ParamType
  schema: z.ZodType | undefined
}

function createParamDecorator(
  type: ParamType,
  schema?: z.ZodType,
): ParameterDecorator {
  return function ParammDecorator(
    target: object,
    propertyKey: string | symbol | undefined,
    index: number,
  ) {
    const existing = (Reflect.getMetadata(
      PARAMS_METADATA_KEY,
      target,
      propertyKey ?? '',
    ) ?? []) as ParamDefinition[]

    existing.push({ index, type, schema })

    Reflect.defineMetadata(
      PARAMS_METADATA_KEY,
      existing,
      target,
      propertyKey ?? '',
    )
  }
}

export function getParams(
  target: object,
  propertyKey: string | symbol,
): ParamDefinition[] {
  return Reflect.getMetadata(
    PARAMS_METADATA_KEY,
    target,
    propertyKey,
  ) as ParamDefinition[]
}

export function parsedSchema(schema: z.ZodType, data: unknown) {
  const parsed = schema.safeParse(data)
  if (!parsed.success)
    throw new HttpError('BAD_REQUEST', {
      message: 'Invalid request data',
      details: z.flattenError(parsed.error).fieldErrors,
    })

  return parsed.data
}

export function Body(schema?: z.ZodType): ParameterDecorator {
  return createParamDecorator(ParamType.BODY, schema)
}
export function Query(schema?: z.ZodType): ParameterDecorator {
  return createParamDecorator(ParamType.QUERY, schema)
}
export function Param(schema?: z.ZodType): ParameterDecorator {
  return createParamDecorator(ParamType.PARAM, schema)
}
export function Cookies(schema?: z.ZodType): ParameterDecorator {
  return createParamDecorator(ParamType.COOKIES, schema)
}
export function Headers(): ParameterDecorator {
  return createParamDecorator(ParamType.HEADERS)
}
export function Req(): ParameterDecorator {
  return createParamDecorator(ParamType.REQUEST)
}
export function Res(): ParameterDecorator {
  return createParamDecorator(ParamType.RESPONSE)
}
export function Next(): ParameterDecorator {
  return createParamDecorator(ParamType.NEXT)
}
