'use client';

import type React from 'react';
import { forwardRef } from 'react';

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

export const FormCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ onCheckedChange, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
        };

        return (
            <input
                ref={ref}
                type="checkbox"
                onChange={handleChange}
                {...props}
            />
        );
    }
);

FormCheckbox.displayName = 'FormCheckbox';
