import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuestContext } from '@/context/QuestContext';
import { QuestForm } from '@/components/cyber/QuestForm';
import { QuestFormData } from '@/types/QuestFormData';
import ThemedBackground from '@/components/cyber/ThemedBackground';
import HeaderCustom from '@/components/cyber/Header';
import { t } from 'i18next';
import { ScrollView, YStack } from 'tamagui';
import { Button } from '@/components/cyber/Button';

export default function EditQuestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { Quests, updateQuestDetails, updateSubQuests, removeQuest } = useQuestContext()!;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const quest = Quests.find(q => q.metadata.id === id);

  useEffect(() => {
    if (!quest) {
      Alert.alert(
        t('edit.notFound'),
        t('edit.notFound'),
        [{ text: t('edit.ok'), onPress: () => router.back() }]
      );
    }
  }, [quest, router]);

  if (!quest) return null;

  const initialFormData: QuestFormData = {
    title: quest.title,
    description: quest.description ?? '',
    subQuests: quest.subQuests ?? [],
    attachments: quest.attachments ?? [],
    enableNotifications: false,// TODO: Add notifications handling
    startDate: quest.metadata.startDate,
    deadline: quest.metadata.deadline,
    reward: quest.metadata.reward?.toString() ?? '',
  };

  const handleSubmit = async (formData: QuestFormData) => {
    setIsLoading(true);
    try {
      const questData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate,
        deadline: formData.deadline,
        reward: formData.reward ? parseFloat(formData.reward) : undefined,
      };

      await updateQuestDetails(quest.metadata.id, questData);
      
      await updateSubQuests(
        quest.metadata.id, 
        formData.subQuests.filter(sq => sq.title.trim())
      );

      Alert.alert(t('edit.success'), t('edit.success'));
      router.push('/');
    } catch (error) {
      console.error('Error updating quest:', error);
      Alert.alert(t('edit.error'), t('edit.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await removeQuest(quest.metadata.id);
      Alert.alert(t('edit.success'), t('edit.success'));
      router.push('/');
    } catch (error) {
      console.error('Error deleting quest:', error);
      Alert.alert(t('edit.error'), t('edit.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedBackground>
      <HeaderCustom headerText={t('edit.header')} back={true} onBackPress={() => router.push('/')} />
      <YStack flex={1}>
        <ScrollView 
          flex={1} 
          showsVerticalScrollIndicator={false}
        >
          <QuestForm
            mode="edit"
            initialData={initialFormData}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/')}
            isLoading={isLoading}
          />
          <Button onPress={handleDelete} margin={10}>{t('edit.delete')}</Button>
        </ScrollView>
      </YStack>
    </ThemedBackground>
  );
}
