import React, { useState } from 'react';
import { 
  YStack, 
  XStack, 
  Text, 
  Separator,
  ScrollView,
  Spacer
} from 'tamagui';
import { useTranslation } from 'react-i18next';
import { InputField } from '@/components/cyber/InputField';
import { Button } from '@/components/cyber/Button';
import { Alert } from 'react-native';
import { SubQuestsList } from '@/components/cyber/SubQuestsList';
import { AttachmentsPicker } from '@/components/cyber/AttachmentsPicker';
import { DatePickerField } from '@/components/cyber/DatePickerField';
import { ImportSection } from '@/components/cyber/ImportSection';
import { QuestFormData } from '@/types/QuestFormData';
import ThemedBox from '@/components/cyber/ThemedBox';
import CustomSwitch from '@/components/cyber/CustomSwitch';
import { useQuestContext } from '@/context/QuestContext';


export function QuestForm({ 
  mode, 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
} : {
  mode: 'add' | 'edit';
  initialData?: Partial<QuestFormData>;
  onSubmit: (data: QuestFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const { refreshQuests } = useQuestContext()!;
  
  const [formData, setFormData] = useState<QuestFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    subQuests: initialData?.subQuests || [],
    attachments: initialData?.attachments || [],
    enableNotifications: initialData?.enableNotifications || false,//TODO Notifications are not implemented yet
    startDate: initialData?.startDate,
    deadline: initialData?.deadline,
    reward: initialData?.reward || '',
  });

  console.log('Data in QuestForm', formData);
  console.log('Initial data in QuestForm', initialData);

  const updateFormData = (updates: Partial<QuestFormData>) => {
    console.log(updates);//TODO
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert(
        t('quests.form.validationError'),
        t('quests.form.titleRequired')
      );
      return;
    }

    try {
      await onSubmit(formData);
      await refreshQuests();
    } catch (error) {
      console.error('Error submitting quest:', error);
      Alert.alert(
        t('quests.form.error'),
        t('quests.form.error')
      );
    }
  };

  return (
    <YStack flex={1} padding="$2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          
          {/* Import - only in add mode */}
          {mode === 'add' && (
            <ThemedBox>
              <ImportSection 
                onImport={(data) => updateFormData(data)}
                disabled={isLoading}
              />
            </ThemedBox>
          )}

          {/* Manual Entry Section */}
          <ThemedBox>
            <Text fontFamily="$bold" fontSize="$5" color="$text" marginBottom="$2">
              {t('quests.form.details')}
            </Text>

            {/* Title */}
            <InputField
              title={t('quests.form.title')}
              placeholder={t('quests.form.titlePlaceholder')}
              value={formData.title}
              onChangeText={(title) => updateFormData({ title })}
            />

            <Spacer size={20} />

            {/* Description */}
            <InputField
              title={t('quests.form.description')}
              placeholder={t('quests.form.descriptionPlaceholder')}
              value={formData.description}
              onChangeText={(description) => updateFormData({ description })}
              minInputHeight={100}
              multiline={true}
            />

            <Spacer size={20} />

            {/* Sub Quests */}
            <SubQuestsList
              subQuests={formData.subQuests}
              onChange={(subQuests) => updateFormData({ subQuests })}
            />

            <Spacer size={20} />
            <Separator borderColor="$borderColor" />
            <Spacer size={20} />

            {/* Attachments */}
            {/* <AttachmentsPicker
              attachments={formData.attachments}
              onChange={(attachments) => updateFormData({ attachments })}
            /> */}
{/* 
            <Spacer size={20} />
            <Separator borderColor="$borderColor" />
            <Spacer size={20} /> */}

            {/* Notifications */}
            {/* <XStack justifyContent="space-between" alignItems="center">
              <Text fontFamily="$bold" fontSize="$4" color="$text">
                {t('quests.form.notifications')}
              </Text>
              <CustomSwitch value={formData.enableNotifications} onValueChange={(enableNotifications) => updateFormData({ enableNotifications })} />
            </XStack> */}
{/* 
            <Spacer size={20} />
            <Separator borderColor="$borderColor" />
            <Spacer size={20} /> */}

            {/* Dates */}
            <XStack gap="$3">
              <YStack flex={1}>
                <DatePickerField
                  label={t('quests.form.startDate')}
                  value={formData.startDate}
                  onChange={(startDate) => updateFormData({ startDate })}
                />
              </YStack>
              
              <YStack flex={1}>
                <DatePickerField
                  label={t('quests.form.deadline')}
                  value={formData.deadline}
                  onChange={(deadline) => updateFormData({ deadline })}
                />
              </YStack>
            </XStack>

            <Spacer size={20} />
            <Separator borderColor="$borderColor" />
            <Spacer size={20} />

            {/* Reward */}
            <InputField
              title={t('quests.form.reward')}
              placeholder={t('quests.form.rewardPlaceholder')}
              value={formData.reward}
              onChangeText={(reward) => updateFormData({ reward })}
              inputMode="numeric"
              keyboardType="numeric"
              onlyNumbers
            />
          </ThemedBox>
          
          {/* <Spacer size={10} /> */}

          {/* Action Buttons */}
          <XStack gap="$3">
            {onCancel && (
              <Button
                flex={1}
                onPress={onCancel}
                disabled={isLoading}
              >
                {t('quests.form.cancel')}
              </Button>
            )}
            
            <Button
              flex={1}
              onPress={handleSubmit}
              disabled={isLoading || !formData.title.trim()}
              loading={isLoading}
            >
              {isLoading 
                ? t('quests.form.saving') 
                : mode === 'add'
                  ? t('quests.form.confirm')
                  : t('quests.form.update')
              }
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}