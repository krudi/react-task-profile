'use client';

import Loading from '@app/loading';
import { authClient } from '@lib/auth/auth-client';
import Link from 'next/link';

export default function Page() {
    const { data: session, isPending: loading } = authClient.useSession();

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <section>
                {session == null ? (
                    <>
                        <Link href="/auth/sign-in">Sign In</Link>
                    </>
                ) : (
                    <>
                        <h1>Willkommen {session.user.name}!</h1>
                    </>
                )}
            </section>
        </>
    );
}
