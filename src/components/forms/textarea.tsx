import { cn } from '@utils/cn';
import { forwardRef } from 'react';

export const FormTextarea = forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
    const dataInvalid = (
        props as Record<string, boolean | 'true' | 'false' | undefined>
    )['data-invalid'];
    const invalid =
        props['aria-invalid'] === 'true' ||
        props['aria-invalid'] === true ||
        dataInvalid === 'true' ||
        dataInvalid === true;

    return (
        <textarea
            ref={ref}
            className={cn(
                'form-textarea',
                invalid && 'form-textarea-error',
                className
            )}
            {...props}
        />
    );
});

FormTextarea.displayName = 'FormTextarea';
