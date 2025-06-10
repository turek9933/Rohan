import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Attachment } from '@/types/Quest';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/cyber/Button';
import { XStack, YStack, Text, useTheme } from 'tamagui';
import CameraIcon from '@/components/cyber/CameraIcon';
import AttachmentIcon from '@/components/cyber/AttachmentIcon';
import ImageIcon from '@/components/cyber/ImageIcon';
import AudioIcon from '@/components/cyber/AudioIcon';
import { getAttachmentType } from '@/types/Quest';

export function AttachmentsPicker({ attachments, onChange } : {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newAttachments: Attachment[] = result.assets.map(asset => ({
          path: asset.uri,
          type: getAttachmentType(asset.uri),
          altText: asset.fileName || 'Selected image',
        }));
        
        onChange([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        t('add.attachmentError'),
        t('add.attachmentError')
      );
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newAttachments: Attachment[] = result.assets.map(asset => ({
          path: asset.uri,
          type: getAttachmentType(asset.uri),
          altText: asset.name,
        }));
        
        onChange([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        t('add.attachmentError'),
        t('add.attachmentError')
      );
    }
  };
  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newAttachments: Attachment[] = result.assets.map(asset => ({
          path: asset.uri,
          type: getAttachmentType(asset.uri),
          altText: asset.name,
        }));
        
        onChange([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
      Alert.alert(
        t('add.attachmentError'),
        t('add.attachmentError')
      );
    }
  };

  const handleRemoveAttachment = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <YStack gap="$2">
      <Text fontFamily="$bold" fontSize="$4" color="$text">
        {t('add.attachments')} ({attachments.length})
      </Text>
      
      <XStack gap="$2" flexWrap="wrap">
        <Button
          onPress={handlePickImage}
          iconAfter={<CameraIcon color={theme.text.val} size={26}/>}
          >
          {t('add.attachmentImage')}
        </Button>
        
        <Button
          onPress={handlePickDocument}
          iconAfter={<AttachmentIcon color={theme.text.val} size={14}/>}
        >
          {t('add.attachmentFile')}
        </Button>

        <Button
          onPress={handlePickAudio}
          iconAfter={<AudioIcon color={theme.text.val} size={16}/>}
        >
          {t('add.attachmentAudio')}
        </Button>
      </XStack>

      {attachments.length > 0 && (
        <YStack gap="$1">
          {attachments.map((attachment, index) => (
            <XStack 
              key={index} 
              gap="$2" 
              alignItems="center" 
              backgroundColor="$background"
              borderRadius={0}
              borderWidth={2}
              borderColor="$borderColor"
            >
              <Text flex={1} fontFamily={"$regular"} fontSize="$3" color="$text" alignSelf='center' paddingHorizontal={10} paddingVertical={0}>
                {
                  attachment.type === 'image' ? 
                  <ImageIcon color={theme.text.val} size={16}/> : 

                  (
                    attachment.type === 'audio' ?
                    <AudioIcon color={theme.text.val} size={16}/> :
                    <AttachmentIcon color={theme.text.val} size={14}/>
                  )
                }
                {'\t'} 
                {attachment.altText}
              </Text>
              <Button
                onPress={() => handleRemoveAttachment(index)}
                padding={"$2"}

              >
                X
              </Button>
            </XStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
}