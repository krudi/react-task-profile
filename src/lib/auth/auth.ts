import { db } from '@drizzle/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    appName: 'react-task-profile',
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        // sendResetPassword: Optional hook for sending password reset emails
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        // sendChangeEmailVerification: Optional hook for change-email confirmation
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60,
        },
    },
    user: {
        changeEmail: {
            enabled: true,
            // sendChangeEmailVerification: Optional hook for change-email confirmation
        },
        deleteUser: {
            enabled: true,
            // sendDeleteAccountVerification: Optional hook for account deletion confirmation
        },
    },
    plugins: [nextCookies()],
});
