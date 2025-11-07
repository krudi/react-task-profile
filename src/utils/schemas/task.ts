import { profileIdSchema } from '@utils/schemas/profile';
import { z } from 'zod';

// Base Fields
export const taskIdSchema = z
    .string()
    .uuid('Aufgaben-ID muss eine gültige UUID sein.');

// Create Task
export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Titel ist erforderlich.')
        .max(120, 'Titel darf höchstens 120 Zeichen lang sein.'),

    description: z
        .string()
        .max(500, 'Beschreibung darf höchstens 500 Zeichen lang sein.')
        .optional()
        .or(z.literal('')),

    dueDate: z
        .string()
        .min(1, 'Fälligkeitsdatum ist erforderlich.')
        .refine(
            (value) => {
                const date = new Date(value);
                if (Number.isNaN(date.getTime())) return false;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return date >= today;
            },
            {
                message:
                    'Fälligkeitsdatum muss heute oder in der Zukunft liegen.',
            }
        ),

    profileId: profileIdSchema,
});

export type CreateTaskType = z.infer<typeof createTaskSchema>;

// Toggle Task Completion
export const toggleTaskSchema = z.object({
    taskId: taskIdSchema,
    completed: z.boolean().optional(),
});

export type ToggleTaskType = z.infer<typeof toggleTaskSchema>;

// Get Tasks for a Profile
export const getTasksSchema = z.object({
    profileId: profileIdSchema,
});

export type GetTasksType = z.infer<typeof getTasksSchema>;

// Delete Task
export const deleteTaskSchema = z.object({
    taskId: taskIdSchema,
});

export type DeleteTaskType = z.infer<typeof deleteTaskSchema>;
