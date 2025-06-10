import { Attachment, SubQuest } from "@/types/Quest";

export interface QuestFormData {
  title: string;
  description: string;
  subQuests: SubQuest[];
  attachments: Attachment[];
  enableNotifications: boolean;
  startDate?: Date;
  deadline?: Date;
  reward?: string;
}
