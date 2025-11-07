'use client';

import { ActionButton } from '@components/general';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient } from '@/lib/auth/auth-client';

const NAV_LINKS = [
    {
        label: 'Startseite',
        href: '/',
    },
    {
        label: 'Profile',
        href: '/profile',
    },
];

export default function Navigation() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [signOutPending, setSignOutPending] = useState(false);

    const handleSignOut = async () => {
        if (signOutPending) return;

        setSignOutPending(true);

        const result = await authClient.signOut();

        setSignOutPending(false);

        if (result?.error) {
            console.warn('Abmeldung fehlgeschlagen', result.error);
            return;
        }

        router.replace('/');
    };

    return (
        <nav
            className="nav"
            aria-label="Hauptnavigation"
        >
            <ul
                className="nav-links"
                role="list"
            >
                {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                        <Link
                            className="nav-link"
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {session?.user && (
                <div className="nav-actions">
                    <ActionButton
                        type="button"
                        action="signOut"
                        isLoading={signOutPending}
                        onClick={handleSignOut}
                    />
                </div>
            )}
        </nav>
    );
}
