// src/validation/schemas.ts
import { z } from 'zod';

export const signUpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});
