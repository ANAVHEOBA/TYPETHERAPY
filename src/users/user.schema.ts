import { z } from "zod";
import {
  ControllerZodSchemaType,
  dateSchema,
  passwordSchema,
  requiredStringSchema,
} from "../schema/common";

const baseUserSchema = z.object({
  firstName: requiredStringSchema("First name"),
  lastName: requiredStringSchema("Last name"),
});

export const createUserInput: ControllerZodSchemaType = z.object({
  body: baseUserSchema.extend({
    email: requiredStringSchema("Email").email("Invalid email"),
    password: passwordSchema(),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const updateUserInput: ControllerZodSchemaType = z.object({
  body: baseUserSchema.extend({
    bio: z.string().optional(),
    contact: requiredStringSchema("Contact"),
    dateOfBirth: dateSchema("Date of birth").refine(
      (dateOfBirth) => {
        const today = new Date();
        const eighteenYearsAgo = new Date(
          today.setFullYear(today.getFullYear() - 18)
        );
        return dateOfBirth <= eighteenYearsAgo;
      },
      { message: "Must be 18 years and above." }
    ),
    gender: z.enum(["male", "female"]),
    occupation: z.enum(["employed", "self-employed", "unemployed", "student"]),
    picture: requiredStringSchema("Picture")
      .url("Invalid url")
      .default(
        "https://img.icons8.com/?size=100&id=82429&format=png&color=000000"
      ),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const authenticateUserInput: ControllerZodSchemaType = z.object({
  body: z.object({
    email: requiredStringSchema("Email").email("Invalid email"),
    password: requiredStringSchema("Password"),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const userVerificationInput: ControllerZodSchemaType = z.object({
  body: z.object({
    otp: requiredStringSchema("OTP"),
  }),
  query: z.object({}),
  params: z.object({}),
});
