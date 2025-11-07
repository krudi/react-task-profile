'use client';

import { cn } from '@utils/cn';
import type React from 'react';
import { forwardRef } from 'react';

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

export const FormCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ onCheckedChange, onChange, className, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
        };

        return (
            <input
                ref={ref}
                type="checkbox"
                onChange={handleChange}
                className={cn('form-checkbox', className)}
                {...props}
            />
        );
    }
);

FormCheckbox.displayName = 'FormCheckbox';
