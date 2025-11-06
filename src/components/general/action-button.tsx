'use client';

import { Loader2 } from 'lucide-react';
import type * as React from 'react';

const ACTIONS = {
    signIn: { label: 'Sign In' },
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
            className={className}
        >
            {isLoading && (
                <>
                    <Loader2 aria-hidden="true" />
                    <span className="sr-only">
                        Processing {label.toLowerCase()}
                    </span>
                </>
            )}
            <span>{label}</span>
        </button>
    );
}
