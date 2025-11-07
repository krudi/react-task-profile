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
};

export function TaskSection({
    title,
    tasks,
    emptyMessage,
    onTaskSelect,
    isLoading = false,
    variant,
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
                                <button
                                    type="button"
                                    onClick={() => onTaskSelect(task)}
                                    className={itemClasses}
                                >
                                    <div className="task-list-title">
                                        {task.title}
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
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
