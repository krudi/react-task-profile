import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

export function FormDescription({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <p className={cn('form-description', className)}>{children}</p>;
}

FormDescription.displayName = 'FormDescription';
