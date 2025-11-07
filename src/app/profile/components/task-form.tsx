'use client';

import {
    FormField,
    FormInput,
    FormLabel,
    FormMessage,
    FormTextarea,
} from '@components/forms';
import type { CreateTaskType } from '@utils/schemas/task';
import type { UseFormReturn } from 'react-hook-form';

type TaskFormProps = {
    form: UseFormReturn<CreateTaskType>;
    isSubmitting: boolean;
    onSubmit: (values: CreateTaskType) => void;
};

export function TaskForm({ form, isSubmitting, onSubmit }: TaskFormProps) {
    const {
        formState: { errors },
    } = form;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-6">
                    <FormField>
                        <FormLabel htmlFor="task-title">Titel</FormLabel>
                        <FormInput
                            id="task-title"
                            type="text"
                            placeholder="Titel"
                            {...form.register('title')}
                            aria-invalid={Boolean(errors.title)}
                        />
                        <FormMessage>{errors.title?.message}</FormMessage>
                    </FormField>
                </div>

                <div className="col-6">
                    <FormField>
                        <FormLabel htmlFor="task-due-date">
                            Fälligkeitsdatum
                        </FormLabel>
                        <FormInput
                            id="task-due-date"
                            type="date"
                            {...form.register('dueDate')}
                            aria-invalid={Boolean(errors.dueDate)}
                        />
                        <FormMessage>{errors.dueDate?.message}</FormMessage>
                    </FormField>
                </div>

                <div className="col-12">
                    <FormField>
                        <FormLabel htmlFor="task-description">
                            Beschreibung
                        </FormLabel>
                        <FormTextarea
                            id="task-description"
                            placeholder="Beschreibung"
                            {...form.register('description')}
                            aria-invalid={Boolean(errors.description)}
                        />
                        <FormMessage>{errors.description?.message}</FormMessage>
                    </FormField>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
            >
                {isSubmitting ? 'Wird hinzugefügt…' : 'Aufgabe hinzufügen'}
            </button>
        </form>
    );
}
