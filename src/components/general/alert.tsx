import type { ReactNode } from 'react';

interface AlertProps {
    children: ReactNode;
    variant?: 'default' | 'destructive';
}

export function Alert({ children }: AlertProps) {
    return <div>{children}</div>;
}

interface AlertDescriptionProps {
    children: ReactNode;
}

export function AlertDescription({ children }: AlertDescriptionProps) {
    return <div>{children}</div>;
}
