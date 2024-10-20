import "dotenv/config";
import { z, ZodError } from "zod";
import {
  convertRequiredStringToNumberSchema,
  requiredStringSchema,
} from "../schema/common";

const EnvironmentVariableSchema = z.object({
  DATABASE_URL: requiredStringSchema("DATABASE_URL"),
  JWT_SECRET: requiredStringSchema("JWT_SECRET").min(
    10,
    "JWT secret is too short."
  ),
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: convertRequiredStringToNumberSchema("PORT"),
});

type AppConfig = z.infer<typeof EnvironmentVariableSchema>;

const setUpConfig = (): AppConfig => {
  try {
    const appConfig = EnvironmentVariableSchema.parse(process.env);

    return appConfig;
  } catch (error) {
    if (error instanceof ZodError) {
      error.errors.map((err) => {
        console.error(`${err.path} -> ${err.message}`);
      });
    }
    throw new Error("Environment variables not set up properly");
  }
};

const appConfig: AppConfig = setUpConfig();

export default appConfig;
