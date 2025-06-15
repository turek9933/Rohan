import { useState } from 'react';
import { Alert } from 'react-native';
import { useQuestContext } from '@/context/QuestContext';
import { QuestForm } from '@/components/cyber/QuestForm';
import { QuestFormData } from '@/types/QuestFormData';
import ThemedBackground from '@/components/cyber/ThemedBackground';
import HeaderCustom from '@/components/cyber/Header';
import { t } from 'i18next';
import { View, ScrollView, YStack, Spacer } from 'tamagui';
import { Button } from '@/components/cyber/Button';
import { useRouter } from 'expo-router';

export default function AddScreen({ onClose }: { onClose?: () => void }) {
    const { addQuest } = useQuestContext()!;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: QuestFormData) => {
        setIsLoading(true);
        try {
            const questData = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            subQuests: formData.subQuests.filter(sq => sq.title.trim()),
            attachments: formData.attachments,
            metadata: {
                status: false,
                startDate: formData.startDate,
                deadline: formData.deadline,
                reward: formData.reward ? parseFloat(formData.reward) : undefined,
            }
            };

            await addQuest(questData);
                
            if (onClose) {
            onClose();
            }

            Alert.alert('Success', 'Quest added successfully!');
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };
    return (
    <ThemedBackground>
        <HeaderCustom headerText={t('add.header')} />
        <YStack flex={1}>
        <ScrollView
            flex={1}
            showsVerticalScrollIndicator={false}
        >
        <QuestForm
            mode="add"
            onSubmit={handleSubmit}
            onCancel={()=> router.back()}
            isLoading={isLoading}
        />
        </ScrollView>
        </YStack>
    </ThemedBackground>
    );
}