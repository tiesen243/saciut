import type { ZodOpenApiPathsObject } from 'zod-openapi'
import z from 'zod/v4'

import {
  FindManySchema,
  FindOneSchema,
  PostSchema,
  StorePostSchema,
} from '@/app/post/post.schema'

export const postOpenAPISpec = {
  '/api/posts': {
    get: {
      tags: ['Posts'],
      summary: 'Get list of posts',
      description:
        'Retrieve a list of posts with optional filtering and pagination.',
      requestParams: { query: FindManySchema },
      responses: {
        200: {
          description: 'Posts retrieved successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(200),
                message: z.literal('Posts retrieved successfully'),
                data: z.array(PostSchema),
              }),
            },
          },
        },
      },
    },
    post: {
      tags: ['Posts'],
      summary: 'Create or update a post',
      description:
        'Create a new post or update an existing one with the provided details.',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: StorePostSchema } },
      },
      responses: {
        201: {
          description: 'Post created successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(201),
                message: z.literal('Post stored successfully'),
                data: PostSchema.pick({ id: true }),
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
                message: z.literal('Authentication required'),
                details: z.string(),
              }),
            },
          },
        },
      },
    },
  },

  '/api/posts/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get a post by ID',
      description: 'Retrieve a single post by its unique ID.',
      requestParams: { path: FindOneSchema },
      responses: {
        200: {
          description: 'Post retrieved successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(200),
                message: z.literal('Post retrieved successfully'),
                data: PostSchema,
              }),
            },
          },
        },
        404: {
          description: 'Post not found',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(404),
                message: z.literal('Post not found'),
                details: z.string(),
              }),
            },
          },
        },
      },
    },

    delete: {
      tags: ['Posts'],
      summary: 'Delete a post by ID',
      description: 'Delete a single post by its unique ID.',
      requestParams: { path: FindOneSchema },
      responses: {
        200: {
          description: 'Post deleted successfully',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(200),
                message: z.literal('Post deleted successfully'),
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
                message: z.literal('Authentication required'),
                details: z.string(),
              }),
            },
          },
        },
        403: {
          description: 'Forbidden - No permission to delete the post',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(403),
                message: z.literal(
                  'You do not have permission to delete this post',
                ),
                details: z.string(),
              }),
            },
          },
        },
        404: {
          description: 'Post not found',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal(404),
                message: z.literal('Post not found'),
                details: z.string(),
              }),
            },
          },
        },
      },
    },
  },
} satisfies ZodOpenApiPathsObject
