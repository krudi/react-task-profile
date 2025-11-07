import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

export function FormLabel({
    htmlFor,
    children,
    className,
}: {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <label
            htmlFor={htmlFor}
            className={cn('form-label', className)}
        >
            {children}
        </label>
    );
}

FormLabel.displayName = 'FormLabel';
