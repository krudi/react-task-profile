'use client';

import React, { ReactNode, useRef } from 'react';

import { cn } from '@/utils/cn';

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export function Dialog({ isOpen, onClose, children }: DialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    if (typeof window !== 'undefined') {
        const dialog = dialogRef.current;

        if (dialog) {
            if (isOpen && !dialog.open) {
                dialog.showModal();
            } else if (!isOpen && dialog.open) {
                dialog.close();
            }
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="dialog"
            onClose={onClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            {children}
        </dialog>
    );
}

export function DialogContent({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={cn('dialog-content', className)}>{children}</div>;
}

export function DialogHeader({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={cn('dialog-header', className)}>{children}</div>;
}

export function DialogTitle({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <h2
            id="dialog-title"
            className={cn('dialog-title', className)}
        >
            {children}
        </h2>
    );
}

export function DialogDescription({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            id="dialog-description"
            className={cn('dialog-description', className)}
        >
            {children}
        </div>
    );
}

export function DialogBody({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={cn('dialog-body', className)}>{children}</div>;
}

type DialogFooterProps = {
    children: ReactNode;
    className?: string;
};
export function DialogFooter({ children, className }: DialogFooterProps) {
    return <div className={cn('dialog-footer', className)}>{children}</div>;
}
