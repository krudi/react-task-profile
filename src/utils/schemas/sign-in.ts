import { z } from 'zod';

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, 'E-Mail ist erforderlich.')
        .email('Ungültige E-Mail-Adresse.'),
    password: z
        .string()
        .min(1, 'Passwort ist erforderlich.')
        .min(8, 'Passwort muss mindestens 8 Zeichen lang sein.')
        .max(32, 'Passwort darf höchstens 32 Zeichen lang sein.'),
    rememberMe: z.boolean().optional(),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
