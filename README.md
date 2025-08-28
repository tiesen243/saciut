# Saciut

## Overview

**Saciut** is a framework that implements a decorator-based architecture built from scratch and designed to work with [Express.js](https://expressjs.com/). The project aims to provide an organized, modular, and scalable structure for building Node.js applications, leveraging the power of decorators for routing, dependency injection, and more.

## Features

- **Decorator-based API:** Use TypeScript decorators to define controllers, routes, and dependencies.
- **Express.js Integration:** Seamlessly integrates with Express to handle HTTP requests and middleware.
- **Modular Structure:** Encourages separation of concerns and scalable application architecture.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/) for package management

### Installation

```bash
# Clone the repository
git clone https://github.com/tiesen243/saciut.git

# Change into the project directory
cd saciut

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Usage

```typescript
import type { Response } from 'express'

import { Controller, Get, Injectable, Module, Res } from '@/core/common'

@Injectable()
class MyService {
  getMessage() {
    return 'Hello from MyService!'
  }
}

@Controller('/hello')
class HelloController {
  constructor(private myService: MyService) {}

  @Get('/')
  sayHello(@Res res: Response) {
    res.send(this.myService.getMessage())
  }
}

@Module({
  imports: [],
  controllers: [HelloController],
  providers: [MyService],
})
class AppModule {}
```

- Define controllers and services with decorators.
- Register your main module to bootstrap your application.

### Run Your Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Documentation

- [Express.js Documentation](https://expressjs.com/)

## License

This project is licensed under the [MIT License](LICENSE).
