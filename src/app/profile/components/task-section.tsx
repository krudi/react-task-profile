'use client';

import { cn } from '@utils/cn';
import { formatDate, isPastDate } from '@utils/format-date';

import type { Task } from '@/types';

type TaskSectionProps = {
    title: string;
    tasks: Task[];
    emptyMessage: string;
    onTaskSelect: (task: Task) => void;
    isLoading?: boolean;
    variant: 'open' | 'completed';
    onTaskDelete?: (task: Task) => void;
    disableDelete?: boolean;
};

export function TaskSection({
    title,
    tasks,
    emptyMessage,
    onTaskSelect,
    isLoading = false,
    variant,
    onTaskDelete,
    disableDelete = false,
}: TaskSectionProps) {
    return (
        <>
            <h2>{title}</h2>
            {isLoading ? (
                <p>Wird geladen…</p>
            ) : tasks.length === 0 ? (
                <p className="task-empty">{emptyMessage}</p>
            ) : (
                <ul className="task-list">
                    {tasks.map((task) => {
                        const overdue =
                            variant === 'open' && isPastDate(task.dueDate);

                        const itemClasses = cn(
                            'task-list-item',
                            overdue && 'task-list-item-overdue',
                            variant === 'completed' &&
                                'task-list-item-completed'
                        );

                        return (
                            <li key={task.id}>
                                <div className={itemClasses}>
                                    <div className="task-list-item-header">
                                        <button
                                            type="button"
                                            className="btn btn-ghost task-list-title"
                                            onClick={() => onTaskSelect(task)}
                                        >
                                            {task.title}
                                        </button>
                                        {variant === 'open' && onTaskDelete && (
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onTaskDelete(task);
                                                }}
                                                disabled={disableDelete}
                                            >
                                                Entfernen
                                            </button>
                                        )}
                                    </div>
                                    <div className="task-list-meta">
                                        <span
                                            className={
                                                overdue
                                                    ? 'task-list-due task-list-due-overdue'
                                                    : 'task-list-due'
                                            }
                                        >
                                            Fällig: {formatDate(task.dueDate)}
                                        </span>
                                        {task.description && (
                                            <span>{task.description}</span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
