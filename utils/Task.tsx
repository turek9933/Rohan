
export interface TaskMetadata {
    id: string;
    status: boolean;
    startDate?: Date;
    deadline?: Date;
    reward?: number;
}

export interface Subtask {
    title: string;
    completed: boolean;
}

export interface Attachment {
    path: string;
    type: 'image' | 'audio' | 'file';
    altText?: string;
    inline?: boolean;
}

export interface Task {
    metadata: TaskMetadata;
    title: string;
    description?: string;
    subtasks?: Subtask[];
    attachments?: Attachment[];
}