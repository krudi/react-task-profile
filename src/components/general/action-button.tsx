'use client';

import { cn } from '@utils/cn';
import { Loader2 } from 'lucide-react';
import type * as React from 'react';

const ACTIONS = {
    signIn: { label: 'Anmelden' },
    createProfile: { label: 'Profil erstellen' },
    signOut: { label: 'Abmelden' },
} as const;

type Action = keyof typeof ACTIONS;

interface ActionButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    isLoading?: boolean;
    action: Action;
}

export function ActionButton({
    isLoading = false,
    action,
    className,
    disabled,
    ...props
}: ActionButtonProps) {
    const { label } = ACTIONS[action];
    const isDisabled = isLoading || disabled;
    return (
        <button
            {...props}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-busy={isLoading}
            className={cn('btn', 'btn-accent', className)}
        >
            {isLoading && (
                <>
                    <Loader2
                        aria-hidden="true"
                        className="btn-spinner"
                    />
                    <span className="sr-only">
                        {`Verarbeite ${label.toLowerCase()}`}
                    </span>
                </>
            )}
            <span>{label}</span>
        </button>
    );
}
