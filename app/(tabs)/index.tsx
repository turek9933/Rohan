import { useState } from 'react';
import { Button } from '@/components/cyber/Button';
import ThemedBackground from '@/components/cyber/ThemedBackground';
import { router } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { useQuestContext } from '@/context/QuestContext';
import QuestItem from '@/components/cyber/QuestItem';
import ThemedBox from '@/components/cyber/ThemedBox';
import HeaderCustom from '@/components/cyber/Header';
import { t } from 'i18next';
import { Text, View, YStack, XStack, Spacer, Sheet } from 'tamagui';
import { SectionList, Alert } from 'react-native';
import { useQuestFilters } from '@/hooks/useQuestFilters';
import { QuestFilterSelectors } from '@/components/cyber/QuestFilterSelectors';

export default function IndexScreen() {
  const { Quests, toggleQuestStatus, toggleSubQuestStatus } = useQuestContext()!;
  const { logout } = useAuthContext();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const { filters, updateFilter, filteredAndSortedQuests, sections } = useQuestFilters(Quests);

  const handleResetFilters = () => {
    updateFilter('sortOption', 'name_asc');
    updateFilter('statusFilter', 'all');
    updateFilter('deadlineFilter', 'all');
    updateFilter('rewardFilter', 'all');
    updateFilter('subQuestFilter', 'all');
  };

  return (
    <ThemedBackground>
      <HeaderCustom headerText={t('quests.header')} />

      <YStack alignItems='center' padding="$2" flex={1}>
        <XStack width="100%" justifyContent="flex-end" marginBottom="$2">
          <Button onPress={() => setFilterSheetOpen(true)}>
            {t('quests.filtersAndSort')}
          </Button>
        </XStack>

            {/* <Button alignSelf="center" onPress={() => {router.push('/(auth)/login');}}>TO LOGIN</Button>
            <Button onPress={() => {logout()}}>LOGOut pLS</Button>
            <Button onPress={() => {router.push('/(tabs)/help');}}>TO Help</Button>
            <Button onPress={() => {router.push('/(tabs)/edit/1');}}>TO edit</Button>
            <Button onPress={() => {console.log(Quests)}}>Print Quests</Button> */}




        {/* Filter and Sort Panel */}
        <Sheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          dismissOnSnapToBottom
          // snapPointsMode="fit"
          snapPoints={[100]}
          modal
        >
          <Sheet.Overlay />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" backgroundColor="$background">
            <QuestFilterSelectors
              filters={filters}
              updateFilter={updateFilter}
              width={400}
            />
            <Spacer size="$3" />
            <Button onPress={handleResetFilters}>
              {t('quests.resetFilters')}
            </Button>
            <Spacer size="$2" />
            <Button onPress={() => setFilterSheetOpen(false)}>
              {t('quests.close')}
            </Button>
          </Sheet.Frame>
        </Sheet>
        

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.metadata.id}
          renderSectionHeader={({ section: { title, data } }) =>
            data.length > 0 ? (
              <Text fontFamily="$bold" color="$title" fontSize="$5" marginTop="$4" marginBottom="$2">
                {t(title)}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <ThemedBox
              key={item.metadata.id}
              alignItems="center"
              padding={0}
              marginBottom={10}
              width="100%"
            >
              <QuestItem
                quest={item}
                onToggleStatus={toggleQuestStatus}
                onEdit={() => {router.push(`/(tabs)/edit/${item.metadata.id}`);}}
                onToggleSubQuest={toggleSubQuestStatus}
              />
            </ThemedBox>
          )}
          ListEmptyComponent={
            <Text color="$text" marginTop="$4">{t('quests.noQuests')}</Text>
          }
          contentContainerStyle={{ paddingBottom: 100, width: '100%' }}
          showsVerticalScrollIndicator={false}
          style={{
            width: '100%',
            paddingHorizontal: 10,
          }}
        />
      </YStack>
    </ThemedBackground>
  );
}