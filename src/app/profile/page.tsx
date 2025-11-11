'use client';

import { ProfileCreateForm, ProfileList } from '@app/profile/components';
import {
    Alert,
    AlertDescription,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/general';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateProfileInput } from '@utils/schemas/profile';
import {
    createProfileSchema,
    type RenameProfileInput,
} from '@utils/schemas/profile';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    createProfile,
    deleteProfile,
    getProfiles,
    renameProfile,
} from '@/lib/actions/profiles';
import { authClient } from '@/lib/auth/auth-client';
import type { Profile } from '@/types';

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const { data: session, isPending: authPending } = authClient.useSession();
    const [profilePendingDelete, setProfilePendingDelete] =
        useState<Profile | null>(null);

    const form = useForm<CreateProfileInput>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: { name: '' },
    });

    const {
        data: profiles = [],
        isPending,
        error,
    } = useQuery<Profile[]>({
        queryKey: ['profiles'],
        queryFn: () => getProfiles(),
        enabled: Boolean(session?.user),
    });

    const createProfileMutation = useMutation({
        mutationFn: (values: CreateProfileInput) => createProfile(values),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profiles'] });
            form.reset({ name: '' });
        },
    });

    const deleteProfileMutation = useMutation({
        mutationFn: (profileId: string) => deleteProfile({ profileId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profiles'] });
            setProfilePendingDelete(null);
        },
    });

    const renameProfileMutation = useMutation({
        mutationFn: (input: RenameProfileInput) => renameProfile(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
    });
    const isDeletePending = deleteProfileMutation.isPending;

    const onSubmit = (values: CreateProfileInput) => {
        createProfileMutation.mutate(values);
    };

    const handleDeleteRequest = (profile: Profile) => {
        deleteProfileMutation.reset();
        setProfilePendingDelete(profile);
    };

    const closeDeleteDialog = () => {
        setProfilePendingDelete(null);
        deleteProfileMutation.reset();
    };

    const confirmDeleteProfile = () => {
        if (!profilePendingDelete) return;
        deleteProfileMutation.mutate(profilePendingDelete.id);
    };
    const handleRenameProfile = async (profileId: string, name: string) => {
        renameProfileMutation.reset();
        await renameProfileMutation.mutateAsync({ profileId, name });
    };

    if (authPending) return;

    if (!session) redirect('/auth/sign-in');

    return (
        <div>
            <h1>Profilverwaltung</h1>

            {(error ||
                createProfileMutation.error ||
                deleteProfileMutation.error ||
                renameProfileMutation.error) && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error?.message ??
                            createProfileMutation.error?.message ??
                            deleteProfileMutation.error?.message ??
                            renameProfileMutation.error?.message}
                    </AlertDescription>
                </Alert>
            )}

            <section
                className="app-section"
                aria-label="Formular zum Erstellen eines neuen Profils"
            >
                <h2>Neues Profil erstellen</h2>

                <ProfileCreateForm
                    form={form}
                    isSubmitting={createProfileMutation.isPending}
                    onSubmit={onSubmit}
                />
            </section>

            <section
                className="app-section"
                aria-label="Übersicht deiner vorhandenen Profile"
            >
                <h2>Deine Profile</h2>

                <ProfileList
                    isLoading={isPending}
                    profiles={profiles}
                    onDeleteRequest={handleDeleteRequest}
                    onRename={handleRenameProfile}
                    isDeletePending={isDeletePending}
                />
            </section>

            <Dialog
                isOpen={!!profilePendingDelete}
                onClose={closeDeleteDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Profil löschen</DialogTitle>
                        <DialogDescription>
                            Diese Aktion löscht dein Profil dauerhaft. Das kann
                            nicht rückgängig gemacht werden.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogContent>
                        <p>
                            Bitte bestätige, dass du dieses Profil wirklich
                            entfernen möchtest.
                        </p>
                    </DialogContent>
                    <DialogFooter aria-busy={isDeletePending}>
                        <button
                            type="button"
                            onClick={closeDeleteDialog}
                            disabled={isDeletePending}
                            className="btn btn-secondary"
                        >
                            Profil behalten
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteProfile}
                            disabled={isDeletePending}
                            className="btn btn-danger"
                        >
                            {isDeletePending
                                ? 'Wird ausgeführt…'
                                : 'Profil löschen'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
