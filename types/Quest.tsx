
export interface QuestMetadata {
    id: string;
    status: boolean;
    startDate?: Date;
    deadline?: Date;
    reward?: number;
}

export interface SubQuest {
    title: string;
    completed: boolean;
}

export interface Attachment {
    path: string;
    type: 'image' | 'audio' | 'file';
    altText?: string;
    inline?: boolean;
}

export interface Quest {
    metadata: QuestMetadata;
    title: string;
    description?: string;
    subQuests?: SubQuest[];
    attachments?: Attachment[];
}


export function compareNames(a: Quest, b: Quest): number {
  return a.title.localeCompare(b.title);
}

export function compareStartDates(a: Quest, b: Quest): number {
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

export function compareDeadlines(a: Quest, b: Quest): number {
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

export function compareRewards(a: Quest, b: Quest): number {
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

export function getAttachmentType(path: string): 'image' | 'audio' | 'file' {
  const ext = path.toLowerCase().split('.').pop();
  console.log(ext);
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return 'audio';
  return 'file';
}