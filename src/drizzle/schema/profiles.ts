import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

import { user } from './auth';

export const profiles = pgTable(
    'profiles',
    {
        id: text('id').primaryKey(),
        name: text('name').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at')
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => ({
        uniqueUserProfile: unique().on(table.userId, table.name),
    })
);
