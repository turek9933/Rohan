import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { useTranslation } from 'react-i18next';
import ThemedBox from '@/components/cyber/ThemedBox';
import CustomRadioButton from '@/components/cyber/CustomRadioButton';

const THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'cyber', label: 'Cyber' },
  { id: 'dark', label: 'Dark' }
];

export const ThemeSelector = ({
    selectedTheme,
    onThemeChange
}: {
    selectedTheme: string;
    onThemeChange: (theme: string) => void;
}) => {
    const { t } = useTranslation();


    return (
        <XStack gap={20} justifyContent="space-around" alignItems="center">
        {THEMES.map((theme) => (
            <YStack key={theme.id} alignItems="center" gap={10}>
            <ThemedBox>
                <Text
                    fontFamily="$regular"
                    fontSize="$4"
                    color="$text"
                    >
                    {theme.label}
                </Text>
            </ThemedBox>
            <CustomRadioButton
                isSelected={selectedTheme === theme.id}
                onPress={() => onThemeChange(theme.id)}
            />
            </YStack>
        ))}
        </XStack>
    );
};