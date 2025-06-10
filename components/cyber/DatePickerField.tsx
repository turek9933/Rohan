import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, YStack, View, useTheme } from 'tamagui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { Button } from '@/components/cyber/Button';

export function DatePickerField({
  label,
  value,
  onChange 
} : {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleWebDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Platform.OS === 'web') {
      const date = event.target.value ? new Date(event.target.value) : undefined;
      onChange(date);
    }
  };

  const formatDateForWeb = (date?: Date) => {
    if (!date) return '';
    //Changes the date format to be compatible with web version
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <YStack gap="$2">
      <Text fontFamily="$bold" fontSize="$4" color="$text">
        {label}
      </Text>
      
      {Platform.OS === 'web' ? (
        <View
          borderWidth={5}
          borderColor="$borderColor"
          backgroundColor="$background"
          borderRadius={0}
          padding="$3"
        >
          <input
            type="date"
            value={formatDateForWeb(value)}
            onChange={handleWebDateChange}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.text.val,
              width: '100%',
            }}
          />
        </View>
      ) : (
        <>
          <Button
            onPress={() => setShowPicker(true)}
          >
            {value ? value.toLocaleDateString() : t('add.dateSelect')}
          </Button>
          
          {showPicker && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </>
      )}
    </YStack>
  );
}