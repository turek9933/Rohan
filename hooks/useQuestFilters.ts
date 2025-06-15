import { useState, useMemo } from 'react';
import { Quest, compareNames, compareStartDates, compareDeadlines, compareRewards } from '@/types/Quest';

export type SortOption = 
  | 'name_asc' | 'name_desc'
  | 'start_date_asc' | 'start_date_desc'
  | 'deadline_asc' | 'deadline_desc'
  | 'reward_asc' | 'reward_desc'
  | 'status_done_first' | 'status_undone_first';

export type StatusFilter = 'all' | 'done' | 'undone';
export type DeadlineFilter = 'all' | 'next_24_hours' | 'next_7_days' | 'next_30_days' | 'overdue';
export type RewardFilter = 'all' | 'with_reward' | 'without_reward';
export type SubQuestFilter = 'all' | 'with_subquests' | 'without_subquests';

export interface QuestFilters {
  sortOption: SortOption;
  statusFilter: StatusFilter;
  deadlineFilter: DeadlineFilter;
  rewardFilter: RewardFilter;
  subQuestFilter: SubQuestFilter;
}

export const useQuestFilters = (quests: Quest[]) => {
  const [filters, setFilters] = useState<QuestFilters>({
    sortOption: 'name_asc',
    statusFilter: 'all',
    deadlineFilter: 'all',
    rewardFilter: 'all',
    subQuestFilter: 'all'
  });

  const updateFilter = <K extends keyof QuestFilters>(
    key: K,
    value: QuestFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedQuests = useMemo(() => {
    let filtered = quests.filter(quest => {

      // Status filter
      if (filters.statusFilter === 'done' && quest.metadata.status) return false;
      if (filters.statusFilter === 'undone' && !quest.metadata.status) return false;

      // Deadline filter
      if (filters.deadlineFilter !== 'all' && quest.metadata.deadline) {
        const now = new Date();
        const deadline = quest.metadata.deadline;
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const questDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

        switch (filters.deadlineFilter) {
          case 'next_24_hours':
            const next_24_hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            return questDeadline <= next_24_hours;
          case 'next_7_days':
            const next_7_days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return questDeadline <= next_7_days;
          case 'next_30_days':
            const next_30_days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            return questDeadline <= next_30_days;
          case 'overdue':
            return questDeadline < today;
        }
      } else if (filters.deadlineFilter !== 'all') {
        return false;// No deadline but we do have a deadline filter
      }

      // Reward filter
      if (filters.rewardFilter === 'with_reward' && !quest.metadata.reward) return false;
      if (filters.rewardFilter === 'without_reward' && quest.metadata.reward) return false;

      // SubQuest filter
      if (filters.subQuestFilter === 'with_subquests' && (!quest.subQuests || quest.subQuests.length === 0)) return false;
      if (filters.subQuestFilter === 'without_subquests' && quest.subQuests && quest.subQuests.length > 0) return false;

      return true;
    });

    filtered.sort((a, b) => {
      switch (filters.sortOption) {
        case 'name_asc':
          return compareNames(a, b);
        case 'name_desc':
          return compareNames(b, a);
        case 'start_date_asc':
          return compareStartDates(a, b);
        case 'start_date_desc':
          return compareStartDates(b, a);
        case 'deadline_asc':
          return compareDeadlines(a, b);
        case 'deadline_desc':
          return compareDeadlines(b, a);
        case 'reward_asc':
          return compareRewards(a, b);
        case 'reward_desc':
          return compareRewards(b, a);
        case 'status_done_first':
          return Number(a.metadata.status) - Number(b.metadata.status);
        case 'status_undone_first':
          return Number(b.metadata.status) - Number(a.metadata.status);
        default:
          return compareNames(a, b);
      }
    });

    return filtered;
  }, [quests, filters]);

  const sections = useMemo(() => [
    {
      title: 'quests.undone',
      data: filteredAndSortedQuests.filter(quest => !quest.metadata.status),
    },
    {
      title: 'quests.done',
      data: filteredAndSortedQuests.filter(quest => quest.metadata.status),
    },
  ], [filteredAndSortedQuests]);

  return {
    filters,
    updateFilter,
    filteredAndSortedQuests,
    sections
  };
};