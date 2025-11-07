'use client';

import { TaskForm, TaskSection } from '@app/profile/components';
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
import { createTaskSchema, type CreateTaskType } from '@utils/schemas/task';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { createTask, getTasks, toggleTask } from '@/lib/actions/tasks';
import type { Task } from '@/types';
import { formatDate } from '@/utils/format-date';

export default function ProfileTasksPage() {
    const { id: profileId } = useParams() as { id: string };
    const queryClient = useQueryClient();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const form = useForm<CreateTaskType>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
            profileId: profileId ?? '',
        },
    });

    const {
        data: tasks = [],
        isPending,
        error,
    } = useQuery<Task[]>({
        queryKey: ['tasks', profileId],
        queryFn: async () => getTasks({ profileId }),
        enabled: Boolean(profileId),
        retry: false,
    });

    const createTaskMutation = useMutation({
        mutationFn: (payload: CreateTaskType) =>
            createTask({ ...payload, profileId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['tasks', profileId],
            });
            form.reset({
                title: '',
                description: '',
                dueDate: '',
                profileId,
            });
        },
    });

    const toggleTaskMutation = useMutation({
        mutationFn: (taskId: string) => toggleTask({ taskId, completed: true }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['tasks', profileId],
            });
            setActiveTask(null);
        },
    });

    const onSubmit = (payload: CreateTaskType) => {
        if (!profileId) return;
        createTaskMutation.mutate({
            ...payload,
            profileId,
        });
    };

    const openTasks = useMemo(
        () =>
            tasks
                .filter((task) => !task.completed)
                .sort((a, b) => {
                    const dueA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                    const dueB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                    return dueA - dueB;
                }),
        [tasks]
    );

    const completedTasks = useMemo(
        () => tasks.filter((task) => task.completed),
        [tasks]
    );

    const openTaskDetails = (task: Task) => {
        toggleTaskMutation.reset();
        setActiveTask(task);
    };

    const closeTaskDetails = () => {
        toggleTaskMutation.reset();
        setActiveTask(null);
    };

    const handleCompleteTask = (taskId: string) => {
        toggleTaskMutation.mutate(taskId);
    };

    return (
        <div>
            <h1>Aufgaben für dieses Profil</h1>

            {(error ||
                createTaskMutation.error ||
                toggleTaskMutation.error) && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error?.message ??
                            createTaskMutation.error?.message ??
                            toggleTaskMutation.error?.message}
                    </AlertDescription>
                </Alert>
            )}

            <section
                className="app-section"
                aria-label="Formular zum Erstellen einer neuen Aufgabe"
            >
                <h2>Aufgabe erstellen</h2>

                <TaskForm
                    form={form}
                    isSubmitting={createTaskMutation.isPending}
                    onSubmit={onSubmit}
                />
            </section>

            <div className="row">
                <section
                    className="app-section col-6"
                    aria-label="Liste der offenen Aufgaben"
                >
                    <TaskSection
                        title="Offene Aufgaben"
                        tasks={openTasks}
                        emptyMessage="Noch keine Aufgaben."
                        onTaskSelect={openTaskDetails}
                        isLoading={isPending}
                        variant="open"
                    />
                </section>

                <section
                    className="app-section col-6"
                    aria-label="Liste der erledigten Aufgaben"
                >
                    <TaskSection
                        title="Erledigte Aufgaben"
                        tasks={completedTasks}
                        emptyMessage="Noch keine erledigten Aufgaben."
                        onTaskSelect={openTaskDetails}
                        variant="completed"
                    />
                </section>
            </div>

            <Dialog
                isOpen={Boolean(activeTask)}
                onClose={closeTaskDetails}
            >
                {activeTask && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{activeTask.title}</DialogTitle>
                        </DialogHeader>

                        <div>
                            <p>Fällig am: {formatDate(activeTask.dueDate)}</p>
                            <p>
                                Status:{' '}
                                {activeTask.completed
                                    ? 'Abgeschlossen'
                                    : 'Offen'}
                            </p>
                        </div>

                        <DialogDescription>
                            <p>
                                Beschreibung:{' '}
                                {activeTask.description?.trim() ||
                                    'Keine Beschreibung vorhanden.'}
                            </p>
                        </DialogDescription>

                        {toggleTaskMutation.error && (
                            <p>{toggleTaskMutation.error.message}</p>
                        )}

                        <DialogFooter>
                            <button
                                type="button"
                                onClick={closeTaskDetails}
                                className="btn btn-secondary"
                            >
                                Schließen
                            </button>

                            {!activeTask.completed && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCompleteTask(activeTask.id)
                                    }
                                    disabled={toggleTaskMutation.isPending}
                                    className="btn btn-primary"
                                >
                                    {toggleTaskMutation.isPending
                                        ? 'Wird abgeschlossen…'
                                        : 'Als erledigt markieren'}
                                </button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
