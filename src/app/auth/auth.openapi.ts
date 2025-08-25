import type { ZodOpenApiPathsObject } from 'zod-openapi'
import z from 'zod'

import { SignInSchema, SignUpSchema, UserSchema } from '@/app/auth/auth.schema'

export const authOpenAPISpec = {
  '/api/auth/get-session': {
    get: {
      tags: ['Auth'],
      summary: 'Get current user session',
      description:
        'Retrieve the current user session based on the provided token.',
      responses: {
        200: {
          description: 'Session retrieved successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(200),
                message: z.literal('Get session successfully'),
                data: UserSchema,
              }),
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(401),
                message: z.literal('Get session failed'),
                details: z.string(),
              }),
            },
          },
        },
      },
    },
  },
  '/api/auth/sign-up': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Create a new user account with the provided details.',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: SignUpSchema } },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(201),
                message: z.literal('Sign up successfully'),
                data: z.object({ userId: z.cuid2() }),
              }),
            },
          },
        },
        400: {
          description:
            'Bad Request - Validation errors or email already in use',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(400),
                message: z.literal('Sign up failed'),
                details: z.string(),
              }),
            },
          },
        },
      },
    },
  },
  '/api/auth/sign-in': {
    post: {
      tags: ['Auth'],
      summary: 'Authenticate a user',
      description: 'Authenticate a user and return a JWT token.',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: SignInSchema } },
      },
      responses: {
        200: {
          description: 'User authenticated successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(200),
                message: z.literal('Sign in successfully'),
                data: z.object({
                  userId: z.cuid2(),
                  token: z.string().startsWith('ey'),
                }),
              }),
            },
          },
        },
        400: {
          description: 'Bad Request - Validation errors or invalid credentials',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(400),
                message: z.literal('Sign in failed'),
                details: z.string(),
              }),
            },
          },
        },
      },
    },
  },
  '/api/auth/sign-out': {
    post: {
      tags: ['Auth'],
      summary: 'Sign out the current user',
      description: 'Invalidate the current user session.',
      responses: {
        200: {
          description: 'User signed out successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(200),
                message: z.literal('Sign out successfully'),
              }),
            },
          },
        },
      },
    },
  },
} satisfies ZodOpenApiPathsObject
