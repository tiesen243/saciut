# saciut

**saciut** is a modular TypeScript server application framework built on top of [Express](https://expressjs.com/). It encourages dependency injection, modular design, and clear separation of concerns, drawing inspiration from frameworks like NestJS.

## Features

- **Dependency Injection**: Easily manage complex dependencies using decorators like `@Injectable`, `@Controller`, and `@Module`.
- **Modular Architecture**: Organize your code into modules for scalability and maintainability.
- **Express Middleware**: Out-of-the-box support for popular middleware such as CORS, cookie parsing, static files, and logging with Morgan.
- **Type-safe Routing**: Use decorators (`@Get`, `@Post`, etc.) for type-safe, declarative routing.
- **Validation**: Parameter decorators support request validation with [zod](https://zod.dev/).
- **Database Ready**: Example integration with `drizzle-orm` for PostgreSQL.
- **View Rendering**: Supports EJS view templates.

## Getting Started

### Prerequisites

- [Bun v1.2.20+](https://bun.com)
- Node.js 18+ (for development tools)
- PostgreSQL (if using database services)

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Configuration

Create a `.env` file based on the provided example:

```bash
cp .env.example .env
```

### Running the App

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The default server will start on [http://localhost:3000](http://localhost:3000).

### Example Structure

- `src/core/`: Core decorators and dependency injection container.
- `src/app/`: Application modules, controllers, and services.
- `src/common/`: Shared utilities and types.
- `views/`: EJS view templates.
- `public/`: Static files.

### Example Usage

**Defining a Module and Controller:**

```typescript
import type { Response } from 'express'

import { Controller, Get, Module, Res } from '@/core'

@Controller('/auth')
class AuthController {
  @Get('/status')
  getStatus(@Res() res: Response) {
    res.json({ status: 'ok', timestamp: Date.now() })
  }
}

@Module({
  controllers: [AuthController],
  providers: [],
})
class AuthModule {}
```

**Bootstrap the application:**

```typescript
import { createApp } from '@/core'

import AuthModule from '@/app/auth/auth.module'

async function bootstrap() {
  const app = await createApp(AuthModule)
  await app.listen(3000)
}
void bootstrap()
```

## License

This project is licensed under the [MIT License](LICENSE).
