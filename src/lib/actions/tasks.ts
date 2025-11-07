'use server';

import { db } from '@drizzle/db';
import { profiles } from '@drizzle/schema/profiles';
import { tasks } from '@drizzle/schema/tasks';
import { auth } from '@lib/auth/auth';
import {
    createTaskSchema,
    deleteTaskSchema,
    getTasksSchema,
    toggleTaskSchema,
} from '@utils/schemas/task';
import { asc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import type { Task } from '@/types';

const toIsoString = (value: Date | string | null | undefined) =>
    value instanceof Date ? value.toISOString() : (value ?? null);

const toTaskDto = (task: typeof tasks.$inferSelect): Task => ({
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    dueDate: toIsoString(task.dueDate),
    completed: task.completed,
    profileId: task.profileId,
    createdAt: toIsoString(task.createdAt),
    updatedAt: toIsoString(task.updatedAt),
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

const assertProfileOwnership = async (
    profileId: string,
    userId: string
): Promise<void> => {
    const [profile] = await db
        .select({ id: profiles.id, userId: profiles.userId })
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

    if (!profile || profile.userId !== userId) {
        throw new Error('Profile not found.');
    }
};

export const getTasks = async (
    input: Parameters<typeof getTasksSchema.parse>[0]
): Promise<Task[]> => {
    const userId = await requireUserId();
    const { profileId } = getTasksSchema.parse(input);

    await assertProfileOwnership(profileId, userId);

    const rows = await db
        .select()
        .from(tasks)
        .where(eq(tasks.profileId, profileId))
        .orderBy(asc(tasks.dueDate), asc(tasks.createdAt));

    return rows.map(toTaskDto);
};

export const createTask = async (
    input: Parameters<typeof createTaskSchema.parse>[0]
): Promise<Task> => {
    const userId = await requireUserId();
    const payload = createTaskSchema.parse(input);

    await assertProfileOwnership(payload.profileId, userId);

    const timestamp = new Date();

    const [created] = await db
        .insert(tasks)
        .values({
            id: crypto.randomUUID(),
            title: payload.title.trim(),
            description: payload.description?.trim() || null,
            dueDate: new Date(payload.dueDate),
            profileId: payload.profileId,
            completed: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        })
        .returning();

    if (!created) {
        throw new Error('Failed to create task.');
    }

    return toTaskDto(created);
};

export const toggleTask = async (
    input: Parameters<typeof toggleTaskSchema.parse>[0]
): Promise<Task> => {
    const userId = await requireUserId();
    const { taskId, completed } = toggleTaskSchema.parse(input);

    const [taskWithProfile] = await db
        .select({
            id: tasks.id,
            profileId: tasks.profileId,
            userId: profiles.userId,
        })
        .from(tasks)
        .innerJoin(profiles, eq(tasks.profileId, profiles.id))
        .where(eq(tasks.id, taskId))
        .limit(1);

    if (!taskWithProfile || taskWithProfile.userId !== userId) {
        throw new Error('Task not found.');
    }

    const [updated] = await db
        .update(tasks)
        .set({
            completed: completed ?? true,
            updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning();

    if (!updated) {
        throw new Error('Failed to update task.');
    }

    return toTaskDto(updated);
};

export const deleteTask = async (
    input: Parameters<typeof deleteTaskSchema.parse>[0]
): Promise<void> => {
    const userId = await requireUserId();
    const { taskId } = deleteTaskSchema.parse(input);

    const [taskWithProfile] = await db
        .select({
            id: tasks.id,
            profileId: tasks.profileId,
            userId: profiles.userId,
        })
        .from(tasks)
        .innerJoin(profiles, eq(tasks.profileId, profiles.id))
        .where(eq(tasks.id, taskId))
        .limit(1);

    if (!taskWithProfile || taskWithProfile.userId !== userId) {
        throw new Error('Task not found.');
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));
};
