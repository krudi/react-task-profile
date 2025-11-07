'use client';

import {
    FormField,
    FormInput,
    FormLabel,
    FormMessage,
} from '@components/forms';
import { ActionButton } from '@components/general';
import type { CreateProfileInput } from '@utils/schemas/profile';
import type { UseFormReturn } from 'react-hook-form';

type ProfileCreateFormProps = {
    form: UseFormReturn<CreateProfileInput>;
    isSubmitting: boolean;
    onSubmit: (values: CreateProfileInput) => void;
};

export function ProfileCreateForm({
    form,
    isSubmitting,
    onSubmit,
}: ProfileCreateFormProps) {
    const nameError = form.formState.errors.name?.message;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField>
                <FormLabel htmlFor="profile-name">Profilname</FormLabel>
                <FormInput
                    id="profile-name"
                    type="text"
                    placeholder="Profilname"
                    {...form.register('name')}
                    aria-invalid={Boolean(nameError)}
                />
                <FormMessage>{nameError}</FormMessage>
            </FormField>

            <ActionButton
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                action="createProfile"
            />
        </form>
    );
}
