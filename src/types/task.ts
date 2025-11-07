export type Task = {
    id: string;
    title: string;
    description: string | null;
    dueDate: string | null;
    completed: boolean;
    profileId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
