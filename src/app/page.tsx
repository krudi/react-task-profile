import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Header from '@/components/header';
import { auth } from '@/lib/auth/auth';

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) redirect('/profile');

    return (
        <>
            <section aria-label="Seitenkopf mit Hauptnavigation">
                <Header />
            </section>
        </>
    );
}
