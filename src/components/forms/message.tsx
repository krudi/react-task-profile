import type { ReactNode } from 'react';

export function FormMessage({ children }: { children?: ReactNode }) {
    if (!children) return null;
    return <div>{children}</div>;
}
