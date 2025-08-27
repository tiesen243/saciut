import type { ZodOpenApiPathsObject } from 'zod-openapi'

export const appOpenAPISpec = {
  '/api/health': {
    get: {
      summary: 'Health Check',
      description: 'Check the health status of the application.',
      responses: {
        200: {
          description: 'Application is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'ok' },
                  database: {
                    type: 'string',
                    example: 'connected',
                    description:
                      'Indicates if the database connection is healthy',
                  },
                },
                required: ['status', 'database'],
              },
            },
          },
        },
      },
    },
  },
} satisfies ZodOpenApiPathsObject
