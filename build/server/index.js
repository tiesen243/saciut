import { createRequestHandler } from "@react-router/express";
import express from "express";
const app = express();
app.use(
  createRequestHandler({
    // @ts-expect-error - vite-plugin-ssr types are wrong
    build: () => import("./assets/server-build-BdRV7AlO.js"),
    getLoadContext() {
      return {};
    }
  })
);
export {
  app
};
