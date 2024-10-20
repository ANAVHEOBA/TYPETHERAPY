import { ErrorRequestHandler, RequestHandler } from "express";
import { CustomHttpError } from "../services/custom-errors";
import { z } from "zod";

export const wrongPathHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: "Route does not exists" });
};

// logError({ content: error.issues, req, res });
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);
  if (error instanceof CustomHttpError) {
    res.status(error.statusCode).json({ message: error.message });
  } else if (error instanceof z.ZodError) {
    const errors = error.issues.map((err) => {
      return { path: err.path.slice(1).join("."), message: err.message };
    });
    res.status(422).json({ errors, message: errors[0].message });
  } else if (process.env.NODE_ENV === "development") {
    res.status(500).json({ error, message: error.message });
  } else {
    res.status(500).json({
      message: "Something went wrong, try again later",
    });
  }
};
