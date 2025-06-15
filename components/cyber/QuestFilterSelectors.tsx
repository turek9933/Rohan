import React from 'react';
import { View, XStack, YStack } from 'tamagui';
import { UniversalSelector } from './UniversalSelector';
import { QuestFilters, SortOption, StatusFilter, DeadlineFilter, RewardFilter, SubQuestFilter } from '@/hooks/useQuestFilters';
import { useTranslation } from 'react-i18next';

export const QuestFilterSelectors = ({
  filters,
  updateFilter,
  width = 180
} : {
  filters: QuestFilters;
  updateFilter: <K extends keyof QuestFilters>(key: K, value: QuestFilters[K]) => void;
  width: number
}) => {
    const { t } = useTranslation();

    const SORT_OPTIONS = [
    { id: 'name_asc', label: t('quests.sort.name_asc') },
    { id: 'name_desc', label: t('quests.sort.name_desc') },
    { id: 'start_date_asc', label: t('quests.sort.start_date_asc') },
    { id: 'start_date_desc', label: t('quests.sort.start_date_desc') },
    { id: 'deadline_asc', label: t('quests.sort.deadline_asc') },
    { id: 'deadline_desc', label: t('quests.sort.deadline_desc') },
    { id: 'reward_asc', label: t('quests.sort.reward_asc') },
    { id: 'reward_desc', label: t('quests.sort.reward_desc') },
    { id: 'status_done_first', label: t('quests.sort.status_done_first') },
    { id: 'status_undone_first', label: t('quests.sort.status_undone_first') }
    ];

    const STATUS_FILTER_OPTIONS = [
    { id: 'all', label: t('quests.filter.status.all') },
    { id: 'done', label: t('quests.filter.status.done') },
    { id: 'undone', label: t('quests.filter.status.undone') }
    ];

    const DEADLINE_FILTER_OPTIONS = [
    { id: 'all', label: t('quests.filter.deadline.all') },
    { id: 'next_24_hours', label: t('quests.filter.deadline.next_24_hours') },
    { id: 'next_7_days', label: t('quests.filter.deadline.next_7_days') },
    { id: 'next_30_days', label: t('quests.filter.deadline.next_30_days') },
    { id: 'overdue', label: t('quests.filter.deadline.overdue') }
    ];

    const REWARD_FILTER_OPTIONS = [
    { id: 'all', label: t('quests.filter.reward.all') },
    { id: 'with_reward', label: t('quests.filter.reward.with_reward') },
    { id: 'without_reward', label: t('quests.filter.reward.without_reward') }
    ];

    const SUBQUEST_FILTER_OPTIONS = [
    { id: 'all', label: t('quests.filter.subquest.all') },
    { id: 'with_subquests', label: t('quests.filter.subquest.with_subquests') },
    { id: 'without_subquests', label: t('quests.filter.subquest.without_subquests') }
    ];

  return (
    <YStack gap="$1" padding="$4" backgroundColor="$backgroundSecondary" borderRadius={0}>

      <View>
        <UniversalSelector
          value={filters.sortOption}
          onValueChange={(value) => updateFilter('sortOption', value as SortOption)}
          options={SORT_OPTIONS}
          prefix={t("quests.sortByPrefix")}
          placeholder={t("quests.sortBy")}
          width={width}
          />
      </View>

      <View>
        <UniversalSelector
          value={filters.statusFilter}
          onValueChange={(value) => updateFilter('statusFilter', value as StatusFilter)}
          options={STATUS_FILTER_OPTIONS}
          prefix={t("quests.statusFilterPrefix")}
          placeholder={t("quests.statusFilter")}
          width={width}
          />
      </View>

      <View>
        <UniversalSelector
          value={filters.deadlineFilter}
          onValueChange={(value) => updateFilter('deadlineFilter', value as DeadlineFilter)}
          options={DEADLINE_FILTER_OPTIONS}
          prefix={t("quests.deadlineFilterPrefix")}
          placeholder={t("quests.deadlineFilter")}
          width={width}
          />
      </View>

      <View>
        <UniversalSelector
          value={filters.rewardFilter}
          onValueChange={(value) => updateFilter('rewardFilter', value as RewardFilter)}
          options={REWARD_FILTER_OPTIONS}
          prefix={t("quests.rewardFilterPrefix")}
          placeholder={t("quests.rewardFilter")}
          width={width}
          />
      </View>

      <View>
        <UniversalSelector
          value={filters.subQuestFilter}
          onValueChange={(value) => updateFilter('subQuestFilter', value as SubQuestFilter)}
          options={SUBQUEST_FILTER_OPTIONS}
          prefix={t("quests.subQuestFilterPrefix")}
          placeholder={t("quests.subQuestFilter")}
          width={width}
        />
      </View>
    </YStack>
  );
};