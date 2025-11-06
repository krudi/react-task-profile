import type { ReactNode } from 'react';

export function FormLabel({
    htmlFor,
    children,
}: {
    htmlFor?: string;
    children: ReactNode;
}) {
    return <label htmlFor={htmlFor}>{children}</label>;
}
