import { cn } from '@utils/cn';
import { forwardRef } from 'react';

export const FormInput = forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
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
        <input
            ref={ref}
            className={cn(
                'form-input',
                invalid && 'form-input-error',
                className
            )}
            {...props}
        />
    );
});

FormInput.displayName = 'FormInput';
