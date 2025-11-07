import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

export function FormField({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={cn('form-field', className)}>{children}</div>;
}

FormField.displayName = 'FormField';
