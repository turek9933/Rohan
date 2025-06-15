import { renderHook, act } from '@testing-library/react';
import { useQuestFilters } from '@/hooks/useQuestFilters';

const sampleQuests = [
  {
    title: 'A Quest',
    description: '',
    subQuests: [],
    attachments: [],
    metadata: {
      id: '1',
      status: false,
      startDate: new Date('2025-01-01'),
      deadline: new Date('2025-01-10'),
      reward: 10,
    },
  },
  {
    title: 'B Quest',
    description: '',
    subQuests: [{ title: 'Sub', completed: false }],
    attachments: [],
    metadata: {
      id: '2',
      status: true,
      startDate: new Date('2025-02-01'),
      deadline: new Date('2025-02-20'),
      reward: 0,
    },
  },
];

describe('useQuestFilters', () => {
  test('filters by - undone', () => {
    const { result } = renderHook(() => useQuestFilters(sampleQuests));
    act(() => {
      result.current.updateFilter('statusFilter', 'undone');
    });
    expect(result.current.filteredAndSortedQuests.length).toBe(1);
    expect(result.current.filteredAndSortedQuests[0].title).toBe('A Quest');
  });

  test('filters by reward', () => {
    const { result } = renderHook(() => useQuestFilters(sampleQuests));
    act(() => {
      result.current.updateFilter('rewardFilter', 'with_reward');
    });
    expect(result.current.filteredAndSortedQuests.length).toBe(1);
    expect(result.current.filteredAndSortedQuests[0].title).toBe('A Quest');
  });

  test('filters by subQuests', () => {
    const { result } = renderHook(() => useQuestFilters(sampleQuests));
    act(() => {
      result.current.updateFilter('subQuestFilter', 'with_subquests');
    });
    expect(result.current.filteredAndSortedQuests.length).toBe(1);
    expect(result.current.filteredAndSortedQuests[0].title).toBe('B Quest');
  });

  test('sorts by name descending', () => {
    const { result } = renderHook(() => useQuestFilters(sampleQuests));
    act(() => {
      result.current.updateFilter('sortOption', 'name_desc');
    });
    expect(result.current.filteredAndSortedQuests[0].title).toBe('B Quest');
  });

  test('filters by status - done', () => {
    const { result } = renderHook(() => useQuestFilters(sampleQuests));
    act(() => {
      result.current.updateFilter('statusFilter', 'done');
    });
    expect(result.current.filteredAndSortedQuests.length).toBe(1);
    expect(result.current.filteredAndSortedQuests[0].title).toBe('B Quest');
  });

  test('filters without reward', () => {
    const { result } = renderHook(() => useQuestFilters(sampleQuests));
    act(() => {
      result.current.updateFilter('rewardFilter', 'without_reward');
    });
    expect(result.current.filteredAndSortedQuests.length).toBe(1);
    expect(result.current.filteredAndSortedQuests[0].title).toBe('B Quest');
  });
});