import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { profiles } from './profiles';

export const tasks = pgTable(
    'tasks',
    {
        id: text('id').primaryKey(),
        title: text('title').notNull(),
        description: text('description'),
        dueDate: timestamp('due_date').notNull(),
        completed: boolean('completed').default(false).notNull(),
        profileId: text('profile_id')
            .notNull()
            .references(() => profiles.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
    })
);
