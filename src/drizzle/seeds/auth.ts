import { auth } from '@lib/auth/auth';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

import { user } from '../schema/auth';

export async function seedAuth() {
    if (!process.env.DATABASE_URL) {
        throw new Error(
            'DATABASE_URL is not set. Please check your environment variables.'
        );
    }

    const db = drizzle(process.env.DATABASE_URL!);

    // Verify email helper
    const verifyEmail = async (userId: string) => {
        await db
            .update(user)
            .set({ emailVerified: true })
            .where(eq(user.id, userId));
    };

    // Create user helper
    const createUser = async ({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) => {
        console.log(`Creating user via Better Auth API: ${email}`);

        const createdUser = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        const userId = createdUser.user.id;
        await verifyEmail(userId);
        return userId;
    };

    // Create the user
    const demoUserId = await createUser({
        name: 'User',
        email: 'user@mail.com',
        password: 'password',
    });

    console.log('Seed completed (auth)', {
        demoUserId,
    });
}
