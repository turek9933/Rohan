
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


export function compareNames(a: Task, b: Task): number {
  return a.title.localeCompare(b.title);
}

export function compareStartDates(a: Task, b: Task): number {
    if (a.metadata.startDate && b.metadata.startDate) {
      return a.metadata.startDate.getTime() - b.metadata.startDate.getTime();
    } else if (a.metadata.startDate && !b.metadata.startDate) {
      return -1;
    } else if (!a.metadata.startDate && b.metadata.startDate) {
      return 1;
    } else {
      return compareNames(a, b);
    }
}

export function compareDeadlines(a: Task, b: Task): number {
    if (a.metadata.deadline && b.metadata.deadline) {
      return a.metadata.deadline.getTime() - b.metadata.deadline.getTime();
    } else if (a.metadata.deadline && !b.metadata.deadline) {
      return -1;
    } else if (!a.metadata.deadline && b.metadata.deadline) {
      return 1;
    } else {
      return compareNames(a, b);
    }
}

export function compareRewards(a: Task, b: Task): number {
    if (a.metadata.reward && b.metadata.reward) {
      return a.metadata.reward - b.metadata.reward;
    } else if (a.metadata.reward && !b.metadata.reward) {
      return -1;
    } else if (!a.metadata.reward && b.metadata.reward) {
      return 1;
    } else {
      return compareNames(a, b);
    }
}