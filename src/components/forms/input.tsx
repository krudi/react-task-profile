import { forwardRef } from 'react';

export const FormInput = forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
    <input
        ref={ref}
        {...props}
    />
));

FormInput.displayName = 'FormInput';
