import { cn } from '@utils/cn';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

type AlertProps = HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'destructive';
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    { className, variant = 'default', ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={cn(
                'alert',
                variant !== 'default' && `alert-${variant}`,
                className
            )}
            {...props}
        />
    );
});

type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = forwardRef<
    HTMLParagraphElement,
    AlertDescriptionProps
>(function AlertDescription({ className, ...props }, ref) {
    return (
        <p
            ref={ref}
            className={cn('alert-description', className)}
            {...props}
        />
    );
});

Alert.displayName = 'Alert';
AlertDescription.displayName = 'AlertDescription';
