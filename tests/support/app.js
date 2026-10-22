import cookieParser from "cookie-parser";
import express from "express";

export function appFor(method, path, handler) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app[method](path, (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  });
  app.use((error, _req, res, _next) => {
    res.status(500).json({
      success: false,
      message: error?.message ?? "Unhandled test error"
    });
  });
  return app;
}

export function appWithMiddleware(method, path, middleware, handler) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app[method](path, middleware, (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  });
  app.use((error, _req, res, _next) => {
    res.status(500).json({
      success: false,
      message: error?.message ?? "Unhandled test error"
    });
  });
  return app;
}

export function idOf(document) {
  return String(document?._id ?? document);
}
