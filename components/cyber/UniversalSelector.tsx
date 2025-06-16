import React from 'react';
import { Text, Select } from 'tamagui';
import SettingsIcon from '@/components/cyber/SettingsIcon';
import { useTheme } from 'tamagui';

export const UniversalSelector = ({
  value,
  onValueChange,
  options,
  prefix = '',
  placeholder,
  width = 200,
  snapPoints = 90
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { id: string; label: string}[];
  prefix?: string;
  placeholder: string;
  width?: number;
  snapPoints?: number
}) => {
  const theme = useTheme();

  // Find current option and set display text
  const currentOption = options.find((option) => option.id === value);
  const displayText = currentOption?.label || placeholder;

  if (!options || options.length === 0) {
    return null;
  }

  return (
      <Select
        value={value}
        onValueChange={onValueChange}
        disablePreventBodyScroll
      >
        <Select.Trigger
          width={width}
          iconAfter={<SettingsIcon 
            color={theme.borderColor?.val ?? '#fff'}
            colorBackground={theme.background?.val ?? '#fff'}
            size={24}
            strokeWidth={10}
          />}
          backgroundColor="$background"
          borderColor="$borderColor"
          borderWidth={4}
          borderRadius={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
            placeholder={placeholder}
          >
            {prefix}{displayText}
          </Select.Value>
        </Select.Trigger>

        
        <Select.Adapt when="sm" platform="touch">
            <Select.Sheet 
            modal 
            dismissOnSnapToBottom
            snapPoints={[snapPoints, 10]}
            >
            <Select.Sheet.Frame
                backgroundColor="$background"
                borderColor="$borderColor"
                borderWidth={4}
                borderRadius={0}
                padding="$4"
            >
                <Select.Sheet.ScrollView 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                >
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
                    {placeholder}
                    </Text>
                </Select.Label>
                {options.map((option, i) => (
                <Select.Item
                    index={i}
                    key={option.id}
                    value={option.id}
                    backgroundColor="$background"
                    borderRadius={0}
                    minHeight={50}
                    paddingVertical="$3"
                    pressStyle={{
                    backgroundColor: "$backgroundHover"
                    }}
                >
                    <Select.ItemText 
                    color="$text"
                    fontFamily="$regular"
                    fontSize="$4"
                    >
                    {option.label}
                    </Select.ItemText>
                </Select.Item>
                ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>
  );
};