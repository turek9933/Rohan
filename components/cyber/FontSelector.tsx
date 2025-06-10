import React from 'react';
import { Text, Select } from 'tamagui';
import { useTranslation } from 'react-i18next';
import SettingsIcon from '@/components/cyber/SettingsIcon';
import { useTheme } from 'tamagui';

const FONTS = [
  { id: 'default', label: 'Default' },
  { id: 'roboto', label: 'Roboto' },
  { id: 'openSans', label: 'Open Sans' },
  { id: 'lato', label: 'Lato' },
  { id: 'montserrat', label: 'Montserrat' }
];

export const FontSelector = ({
selectedFont,
onFontChange } : {
    selectedFont: string;
    onFontChange: (font: string) => void;
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const iconProps = {
        color: theme.borderColor?.val ?? '#fff',
        colorBackground: theme.background?.val ?? '#fff',
        size: 24,
        strokeWidth: 10
    };

    // Znajdź aktualny font
    const currentFont = FONTS.find((font) => font.id === selectedFont);
    const displayText = currentFont?.label || t('settings.fontPlaceholder');

    return (
    <Select
    value={selectedFont}
    onValueChange={onFontChange}
    disablePreventBodyScroll
    >
    <Select.Trigger
    width={200}
    // height={60}
    iconAfter={<SettingsIcon {...iconProps}/>}
    backgroundColor="$background"
    borderColor="$borderColor"
    borderWidth={4}
    borderRadius={0}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    // delayLongPress={500}
    pressStyle={{
        backgroundColor: "$backgroundHover",
        borderColor: "$text"
    }}
    focusStyle={{
        backgroundColor: "$backgroundHover",
        borderColor: "$text"
    }}
    >
        <Select.Value
        fontFamily="$regular"
        color="$text"
        placeholder={t('settings.fontPlaceholder')}
        >
            {displayText}
        </Select.Value>
    </Select.Trigger>

    <Select.Adapt when="sm" platform="touch">
        <Select.Sheet 
        modal 
        dismissOnSnapToBottom
        snapPointsMode="fit"
        >
        <Select.Sheet.Frame
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={4}
            borderRadius={0}
            padding="$4"
        >
            <Select.Sheet.ScrollView showsVerticalScrollIndicator={false}>
            <Select.Adapt.Contents />
            </Select.Sheet.ScrollView>
        </Select.Sheet.Frame>
        <Select.Sheet.Overlay 
            backgroundColor="rgba(0,0,0,0.5)"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
        />
        </Select.Sheet>
    </Select.Adapt>

    <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
        alignItems="center"
        justifyContent="center"
        position="relative"
        width="100%"
        height="$3"
        >
        <Text color="$text">↑</Text>
        </Select.ScrollUpButton>

        <Select.Viewport 
        minHeight={200}
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={4}
        borderRadius={0}
        >
        <Select.Group>
            <Select.Label 
            paddingHorizontal="$4"
            >
                <Text
                fontFamily={"$bold"}
                fontSize="$4"
                color="$title"
                >
                {t('settings.fontPlaceholder')}
                </Text>
            </Select.Label>
            
            {FONTS.map((font, i) => (
            <Select.Item
                index={i}
                key={font.id}
                value={font.id}
                backgroundColor="$background"
                borderRadius={0}
                minHeight={50}
                paddingVertical="$3"
                pressStyle={{
                backgroundColor: "$backgroundHover"
                }}
                hoverStyle={{
                backgroundColor: "$backgroundHover"
                }}
                focusStyle={{
                backgroundColor: "$backgroundHover"
                }}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
                <Select.ItemText 
                color="$text"
                fontFamily="$regular"
                fontSize="$4"
                >
                {font.label}
                </Select.ItemText>
                
                <Select.ItemIndicator marginLeft="auto">
                <Text
                    color="$text"
                    fontFamily="$bold"
                    backgroundColor="$backgroundSecondary"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius={0}
                    fontSize="$3"
                >
                    X
                </Text>
                </Select.ItemIndicator>
            </Select.Item>
            ))}
        </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
        alignItems="center"
        justifyContent="center"
        position="relative"
        width="100%"
        height="$3"
        >
        <Text color="$text">↓</Text>
        </Select.ScrollDownButton>
    </Select.Content>
    </Select>
    );
};