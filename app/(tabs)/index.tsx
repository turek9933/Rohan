import { useState } from 'react';
import { Text, Image, StyleSheet, Platform } from 'react-native';
import { compareStartDates, compareDeadlines, compareNames, compareRewards } from '@/utils/Task';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const { quests, editQuest, toggleQuest } = useQuestContext()!;
  type SortOption = 'start_desc' | 'start_asc' | 'deadline_desc' | 'deadline_asc' | 'name_asc' | 'name_desc' | 'reward_asc' | 'reward_desc';
  const [sortOption, setSortOption] = useState<SortOption>('deadline_desc');
  
  const sortedQuests = [...quests].sort((a, b) => {
    switch (sortOption) {
      case 'start_desc':
        return compareStartDates(b, a);
      case 'start_asc':
        return compareStartDates(a, b);
      case 'deadline_desc':
        return compareDeadlines(b, a);
      case 'deadline_asc':
        return compareDeadlines(a, b);
      case 'name_asc':
        return compareNames(a, b);
      case 'name_desc':
        return compareNames(b, a);
      case 'reward_asc':
        return compareRewards(a, b);
      case 'reward_desc':
        return compareRewards(b, a);
    }
  })

  const sections = [
    {
      title: "Undone",//TODO: translate
      data: sortedQuests.filter(item => !item.metadata.status),
    },
    {
      title: "Done",
      data: sortedQuests.filter(item => item.metadata.status),
    },
  ];
  
  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text>{section.title}</Text>
  );

  return (
    <Text style={styles.titleContainer}>Hello World</Text>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
