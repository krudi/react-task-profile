import { z } from 'zod';

// Base Fields
export const profileNameSchema = z
    .string()
    .trim()
    .min(1, 'Name ist erforderlich.')
    .max(60, 'Name darf höchstens 60 Zeichen lang sein.');

export const profileIdSchema = z
    .string()
    .uuid('Profilkennung muss eine gültige UUID sein.');

// Create Profile
export const createProfileSchema = z.object({
    name: profileNameSchema,
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;

// Update Profile
export const updateProfileSchema = createProfileSchema;

export const renameProfileSchema = updateProfileSchema.extend({
    profileId: profileIdSchema,
});

export type RenameProfileInput = z.infer<typeof renameProfileSchema>;

// Delete Profile
export const deleteProfileSchema = z.object({
    profileId: profileIdSchema,
});

export type DeleteProfileInput = z.infer<typeof deleteProfileSchema>;

// Exported Utility Types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ProfileSchemaType = CreateProfileInput;
