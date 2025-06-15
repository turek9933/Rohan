import { QuestFormData } from "@/types/QuestFormData";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { YStack, Text } from "tamagui";
import { Button } from "@/components/cyber/Button";
import { importSingleQuest } from "@/utils/importQuest";
import { useState } from "react";

export function ImportSection({
  onImport, disabled } : {
    onImport: (data: Partial<QuestFormData>) => void;
    disabled?: boolean;
  }) {
  const { t } = useTranslation();
  const [isImporting, setIsImporting] = useState(false);

  const handleImportFromMarkdown = async () => {
    if (disabled) return;

    setIsImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        //TODO For feature files import
        type: [
        'text/plain',
        'text/markdown',
        'text/x-markdown',
        'application/json',
        'application/xml',
        '.md',
        ],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const file = result.assets[0]; 
      if (!file.name?.endsWith('.md')) {
        Alert.alert(
          t('quests.form.importError'),
          t('quests.form.importError')
        );
        setIsImporting(false);
        return;
      }
      
      const importedQuest = await importSingleQuest(file.uri);
      console.log("Imported quest:\t", importedQuest);
      
      if (importedQuest) {
        onImport(importedQuest);
        setIsImporting(false);
        Alert.alert(t('quests.form.importSuccess'), `Quest "${importedQuest.title}" imported successfully!`);//TODO
      } else {
        Alert.alert(t('quests.form.importError'), 'No valid quest found in the file');
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert(
        t('quests.form.importError'),
        t('quests.form.importError')
      );
    } finally {
      setIsImporting(false);
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
        {t('quests.form.importTitle')}
      </Text>
      <Button
        onPress={handleImportFromMarkdown}
        disabled={disabled}
        width={300}
        alignSelf="center"
      >
        {t('quests.form.importFromMarkdown')}
      </Button>
    </YStack>
  );
}