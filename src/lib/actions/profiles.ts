'use server';

import { db } from '@drizzle/db';
import { profiles } from '@drizzle/schema/profiles';
import { auth } from '@lib/auth/auth';
import {
    createProfileSchema,
    deleteProfileSchema,
    renameProfileSchema,
} from '@utils/schemas/profile';
import { asc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import type { Profile } from '@/types';

const toIsoString = (value: Date | string | null | undefined) =>
    value instanceof Date ? value.toISOString() : (value ?? null);

const toProfileDto = (profile: typeof profiles.$inferSelect): Profile => ({
    id: profile.id,
    name: profile.name,
    userId: profile.userId,
    createdAt: toIsoString(profile.createdAt),
    updatedAt: toIsoString(profile.updatedAt),
});

const requireUserId = async (): Promise<string> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error('Unauthorized');
    }

    return session.user.id;
};

export const getProfiles = async (): Promise<Profile[]> => {
    const userId = await requireUserId();

    const rows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .orderBy(asc(profiles.createdAt));

    return rows.map(toProfileDto);
};

export const createProfile = async (
    input: Parameters<typeof createProfileSchema.parse>[0]
): Promise<Profile> => {
    const userId = await requireUserId();
    const { name } = createProfileSchema.parse(input);
    const normalizedName = name.trim();

    const duplicates = await db
        .select({ id: profiles.id, name: profiles.name })
        .from(profiles)
        .where(eq(profiles.userId, userId));

    const hasDuplicate = duplicates.some(
        (profile) =>
            profile.name.trim().toLocaleLowerCase() ===
            normalizedName.toLocaleLowerCase()
    );

    if (hasDuplicate) {
        throw new Error('Profile name already exists.');
    }

    const timestamp = new Date();

    const [created] = await db
        .insert(profiles)
        .values({
            id: crypto.randomUUID(),
            name: normalizedName,
            userId,
            createdAt: timestamp,
            updatedAt: timestamp,
        })
        .returning();

    if (!created) {
        throw new Error('Failed to create profile.');
    }

    return toProfileDto(created);
};

export const deleteProfile = async (
    input: Parameters<typeof deleteProfileSchema.parse>[0]
): Promise<void> => {
    const userId = await requireUserId();
    const { profileId } = deleteProfileSchema.parse(input);

    const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

    if (!profile || profile.userId !== userId) {
        throw new Error('Profile not found.');
    }

    await db.delete(profiles).where(eq(profiles.id, profileId));
};

export const renameProfile = async (
    input: Parameters<typeof renameProfileSchema.parse>[0]
): Promise<Profile> => {
    const userId = await requireUserId();
    const { profileId, name } = renameProfileSchema.parse(input);
    const normalizedName = name.trim();

    const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

    if (!profile || profile.userId !== userId) {
        throw new Error('Profile not found.');
    }

    const duplicates = await db
        .select({ id: profiles.id, name: profiles.name })
        .from(profiles)
        .where(eq(profiles.userId, userId));

    const hasDuplicate = duplicates.some(
        (existing) =>
            existing.id !== profileId &&
            existing.name.trim().toLocaleLowerCase() ===
                normalizedName.toLocaleLowerCase()
    );

    if (hasDuplicate) {
        throw new Error('Profile name already exists.');
    }

    const [updated] = await db
        .update(profiles)
        .set({
            name: normalizedName,
            updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId))
        .returning();

    if (!updated) {
        throw new Error('Failed to update profile.');
    }

    return toProfileDto(updated);
};
