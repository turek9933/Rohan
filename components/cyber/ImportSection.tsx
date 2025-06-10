import { QuestFormData } from "@/types/QuestFormData";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { YStack, Text } from "tamagui";
import { Button } from "@/components/cyber/Button";

export function ImportSection({
  onImport, disabled } : {
    onImport: (data: Partial<QuestFormData>) => void;
    disabled?: boolean;
  }) {
  const { t } = useTranslation();

  const handleImportFromMarkdown = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        if (file.name?.endsWith('.md')) {
          //TODO dodać obsługę importu, na razie tylko wyświetlanie alertu
          Alert.alert(
            t('add.importTitle'),
            t('add.importFeature')
          );
        } else {
          Alert.alert(
            t('add.importError'),
            t('add.importError')
          );
        }
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert(
        t('add.importError'),
        t('add.importError')
      );
    }
  };

  return (
    <YStack 
    borderRadius='$0'
    padding='$4'
    borderWidth={0}
    borderColor='$borderColor'

    gap={20}
    >
      <Text
      fontFamily="$bold"
      fontSize="$5"
      color="$text"
      alignSelf="center"
      >
        {t('add.importTitle')}
      </Text>
      <Button
        onPress={handleImportFromMarkdown}
        disabled={disabled}
        width={300}
        alignSelf="center"
      >
        {t('add.importFromMarkdown')}
      </Button>
    </YStack>
  );
}