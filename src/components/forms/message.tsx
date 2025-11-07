import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

export function FormMessage({
    children,
    className,
}: {
    children?: ReactNode;
    className?: string;
}) {
    if (!children) return null;

    return <span className={cn('form-text-error', className)}>{children}</span>;
}

FormMessage.displayName = 'FormMessage';
