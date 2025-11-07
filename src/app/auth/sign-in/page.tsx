'use client';

import { ActionButton, Alert, AlertDescription } from '@components/general';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInSchemaType } from '@utils/schemas/sign-in';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    FormCheckbox,
    FormField,
    FormInput,
    FormLabel,
    FormMessage,
} from '@/components/forms';
import { authClient } from '@/lib/auth/auth-client';

export default function AuthSignInPage() {
    const [pendingCredentials, setPendingCredentials] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: true,
        },
    });

    const onSubmit = async (values: SignInSchemaType) => {
        setError(null);
        setPendingCredentials(true);

        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
        });

        if (error) setError(error.message ?? 'Etwas ist schiefgelaufen.');
        else {
            router.refresh();
            router.push('/');
        }
        setPendingCredentials(false);
    };

    const {
        formState: { errors },
    } = form;

    return (
        <div className="card">
            <div className="card-header">
                <h1 className="card-title">Willkommen</h1>
                <p className="card-subtitle">
                    Melde dich an, um Profile und Aufgaben zu erstellen.
                </p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField>
                    <FormLabel htmlFor="email">E-Mail</FormLabel>
                    <FormInput
                        id="email"
                        type="email"
                        placeholder="user@mail.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        {...form.register('email')}
                    />
                    <FormMessage>{errors.email?.message}</FormMessage>
                </FormField>

                <FormField>
                    <FormLabel htmlFor="password">Passwort</FormLabel>
                    <FormInput
                        id="password"
                        placeholder="Passwort"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.password)}
                        {...form.register('password')}
                    />
                    <FormMessage>{errors.password?.message}</FormMessage>
                </FormField>

                <FormField className="form-field-horizontal">
                    <FormCheckbox
                        id="rememberMe"
                        checked={form.watch('rememberMe')}
                        onCheckedChange={(checked) =>
                            form.setValue('rememberMe', checked)
                        }
                    />
                    <FormLabel htmlFor="rememberMe">
                        Dieses Gerät merken
                    </FormLabel>
                </FormField>

                <ActionButton
                    type="submit"
                    action="signIn"
                    disabled={pendingCredentials}
                    isLoading={pendingCredentials}
                />
            </form>
        </div>
    );
}
