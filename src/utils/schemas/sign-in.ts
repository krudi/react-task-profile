import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().min(1, 'Email is required.').email('Invalid email.'),
    password: z
        .string()
        .min(1, 'Password is required.')
        .min(8, 'Password must be at least 8 characters.')
        .max(32, 'Password must not exceed 32 characters.'),
    rememberMe: z.boolean().optional(),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
