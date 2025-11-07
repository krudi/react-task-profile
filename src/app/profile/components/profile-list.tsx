'use client';

import {
    FormField,
    FormInput,
    FormLabel,
    FormMessage,
} from '@components/forms';
import { formatDate } from '@utils/format-date';
import Link from 'next/link';
import { useState } from 'react';

import type { Profile } from '@/types';

type ProfileListProps = {
    isLoading: boolean;
    profiles: Profile[];
    onDeleteRequest: (profile: Profile) => void;
    onRename: (profileId: string, name: string) => Promise<void>;
    isDeletePending?: boolean;
};

export function ProfileList({
    isLoading,
    profiles,
    onDeleteRequest,
    onRename,
    isDeletePending = false,
}: ProfileListProps) {
    const [editingProfileId, setEditingProfileId] = useState<string | null>(
        null
    );
    const [renameValue, setRenameValue] = useState('');
    const [renameError, setRenameError] = useState<string | null>(null);
    const [renamePending, setRenamePending] = useState(false);

    const startRename = (profile: Profile) => {
        setRenameError(null);
        setEditingProfileId(profile.id);
        setRenameValue(profile.name);
    };

    const cancelRename = () => {
        setRenameError(null);
        setEditingProfileId(null);
        setRenameValue('');
    };

    const submitRename = async (profileId: string) => {
        if (!renameValue.trim()) {
            setRenameError('Name ist erforderlich.');
            return;
        }

        setRenamePending(true);
        setRenameError(null);

        try {
            await onRename(profileId, renameValue.trim());
            setEditingProfileId(null);
            setRenameValue('');
        } catch (error) {
            setRenameError(
                error instanceof Error
                    ? error.message
                    : 'Profil konnte nicht umbenannt werden.'
            );
        } finally {
            setRenamePending(false);
        }
    };

    if (isLoading) {
        return <p>Profile werden geladen…</p>;
    }

    if (profiles.length === 0) {
        return <p>Noch keine Profile. Erstelle oben dein erstes Profil!</p>;
    }

    return (
        <div className="profile-list">
            {profiles.map((profile) => {
                const isEditing = editingProfileId === profile.id;
                const inputId = `profile-rename-${profile.id}`;

                return (
                    <div
                        key={profile.id}
                        className="profile-list-item"
                    >
                        {isEditing ? (
                            <form
                                className="profile-list-rename-form"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    submitRename(profile.id);
                                }}
                            >
                                <FormField>
                                    <FormLabel htmlFor={inputId}>
                                        Profil umbenennen
                                    </FormLabel>
                                    <FormInput
                                        id={inputId}
                                        value={renameValue}
                                        onChange={(event) =>
                                            setRenameValue(event.target.value)
                                        }
                                        placeholder="Profilname"
                                        autoFocus
                                        aria-invalid={Boolean(renameError)}
                                    />
                                    <FormMessage>{renameError}</FormMessage>
                                </FormField>

                                <div className="btn-group">
                                    <button
                                        type="submit"
                                        disabled={renamePending}
                                        className="btn btn-primary"
                                    >
                                        {renamePending
                                            ? 'Speichert…'
                                            : 'Speichern'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelRename}
                                        className="btn btn-secondary"
                                    >
                                        Abbrechen
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="profile-list-meta">
                                    <Link
                                        href={`/profile/${profile.id}`}
                                        className="profile-list-link"
                                    >
                                        {profile.name}
                                    </Link>
                                    <p className="profile-list-created">
                                        Erstellt:{' '}
                                        {formatDate(profile.createdAt)}
                                    </p>
                                </div>

                                <div className="btn-group">
                                    <button
                                        onClick={() => startRename(profile)}
                                        disabled={renamePending}
                                        className="btn btn-secondary"
                                    >
                                        Umbenennen
                                    </button>
                                    <button
                                        onClick={() => onDeleteRequest(profile)}
                                        disabled={isDeletePending}
                                        className="btn btn-danger"
                                    >
                                        Löschen
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
