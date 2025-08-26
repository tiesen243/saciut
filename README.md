# saciut

**saciut** is a modular TypeScript server application framework built on top of [Express](https://expressjs.com). It is designed to provide a scalable and maintainable architecture for backend applications, emphasizing modularity, dependency injection, and ease of use.

## Key Features

- **Modular Architecture**: Organize your codebase in a clean and scalable way using modules, controllers, and services.
- **Dependency Injection**: Simplifies management of dependencies, promoting testability and flexibility.
- **Express Integration**: Leverages the power and familiarity of Express, with added structure for large applications.
- **First-Class TypeScript Support**: Built with TypeScript for type safety and modern development experience.
- **EJS View Support**: Easily render dynamic HTML using EJS templates.
- **Database Ready**: Example integration with `drizzle-orm` for working with PostgreSQL databases.
- **Modern Frontend Tools**: Designed to work well with frontend frameworks like React, Vite, and TailwindCSS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer
- [PostgreSQL](https://www.postgresql.org/) (if using database features)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/tiesen243/saciut.git
cd saciut

npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Configuration

Create an `.env` file in the project root to set environment variables (see `.env.example` for reference).

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Building for Production

```bash
npm run build
# or
yarn build 
# or
pnpm build
# or
bun run build
```


## License

This project is licensed under the [MIT License](LICENSE).