// src/types/express/index.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Add userId property here
      user?: Record<string, any>; // Keep your existing user property
    }
  }
}
