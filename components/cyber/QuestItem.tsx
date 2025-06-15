import React, { useState } from 'react';
import { View, Text, Image, Separator, Spacer, XStack } from 'tamagui';
import { Pressable, Alert, Linking, Share } from 'react-native';
import { Quest } from '@/types/Quest';
import SettingsIcon from './SettingsIcon';
import { useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import AudioIcon from '@/components/cyber/AudioIcon';
import ImageIcon from '@/components/cyber/ImageIcon';
import AttachmentIcon from '@/components/cyber/AttachmentIcon';
import CustomSwitch from '@/components/cyber/CustomSwitch';
import UpDownIcon from '@/components/cyber/UpDownIcon';
import { Button } from '@/components/cyber/Button';
import ShareIcon from '@/components/cyber/ShareIcon';

const QuestItem = ({
  quest,
  onToggleStatus,
  onToggleSubQuest,
  onEdit
} : {
  quest: Quest;
  onToggleStatus: (questId: string) => void;
  onToggleSubQuest: (questId: string, subQuestIndex: number) => void;
  onEdit: (questId: string) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubQuestToggle = (subQuestIndex: number) => {
    onToggleSubQuest(quest.metadata.id, subQuestIndex);
  };

  const handleEdit = () => {
    onEdit(quest.metadata.id);
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'None';
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleImagePress = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleAudioPress = async (audioPath: string) => {
    try {
      //TODO add audio player
      Alert.alert('Audio', `Playing: ${audioPath.split('/').pop()}`);
    } catch (error) {
      Alert.alert('Error', 'Cannot play audio file');
    }
  };

  const handleDocumentPress = async (documentPath: string, fileName: string) => {
    try {
      //TODO Trying to open document via Linking
      const supported = await Linking.canOpenURL(documentPath);
      if (supported) {
        await Linking.openURL(documentPath);
      } else {
        Alert.alert(
          'Open Document',
          `Do you want to open ${fileName}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open', 
              onPress: () => {
                Alert.alert('Info', 'Document handling not implemented yet');
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot open document');
    }
  };

  const renderAttachment = (attachment: any, index: number) => {
    const fileName = attachment.path.split('/').pop() || attachment.altText || `Attachment ${index + 1}`;
    
    switch (attachment.type) {
      case 'image':
        return (
          <Pressable key={index} onPress={() => handleImagePress(attachment.path)}>
            <View
              borderWidth={2}
              borderColor="$borderColor"
              borderRadius={0}
              marginBottom="$2"
              marginRight="$2"
              backgroundColor="$background"
            >
              <Image
                source={{ uri: attachment.path }}
                width={80}
                height={80}
                borderRadius={0}
                resizeMode="cover"
              />
              <View 
                position="absolute" 
                bottom={0} 
                left={0} 
                right={0} 
                backgroundColor="rgba(0,0,0,0.7)"
                padding="$1"
              >
                <Text color="white" fontSize="$2" numberOfLines={1}>
                  <ImageIcon color="white" size={12} /> {fileName}
                </Text>
              </View>
            </View>
          </Pressable>
        );

      case 'audio':
        return (
          <Pressable key={index} onPress={() => handleAudioPress(attachment.path)}>
            <View
              flexDirection="row"
              alignItems="center"
              backgroundColor="$background"
              borderWidth={2}
              borderColor="$borderColor"
              borderRadius={0}
              padding="$2"
              marginBottom="$2"
              marginRight="$2"
              minWidth={150}
            >
              <AudioIcon color={theme.text?.val} size={16} />
              <Text color="$text" fontSize="$3" marginLeft="$2" flex={1} numberOfLines={1}>
                {fileName}
              </Text>
              <Text color="$textSecondary" fontSize="$2">
                ▶️
              </Text>
            </View>
          </Pressable>
        );

      default:
        return (
          <Pressable key={index} onPress={() => handleDocumentPress(attachment.path, fileName)}>
            <View
              flexDirection="row"
              alignItems="center"
              backgroundColor="$background"
              borderWidth={2}
              borderColor="$borderColor"
              borderRadius={0}
              padding="$2"
              marginBottom="$2"
              marginRight="$2"
              minWidth={150}
            >
              <AttachmentIcon color={theme.text?.val} size={14} />
              <Text color="$text" fontSize="$3" marginLeft="$2" flex={1} numberOfLines={1}>
                {fileName}
              </Text>
              <Text color="$textSecondary" fontSize="$2">
                📄
              </Text>
            </View>
          </Pressable>
        );
    }
  };


  function handleShare() {
    const message = [
      `${t('quests.title')}: ${quest.title}`,
      quest.description ? `${t('quests.description')}: ${quest.description}` : '',
      quest.metadata.deadline ? `${t('quests.deadline')}: ${quest.metadata.deadline.toDateString()}` : '',
      quest.metadata.reward ? `${t('quests.reward')}: ${quest.metadata.reward}` : '',
      quest.metadata.status ? `${t('quests.status')}: ${quest.metadata.status ? t('quests.done') : t('quests.undone')}` : '',
    ].filter(Boolean).join('\n');

    Share.share({
      message,
      title: t('quests.shareTitle'),
    })
  }

  return (
    <>
      <View
        // backgroundColor="$background"
        borderWidth={4}
        borderColor="$borderColor"
        borderRadius={0}
        margin={0}
        overflow="hidden"
        width={'100%'}
        minWidth={300}
      >
        {/* Head */}
        <View
          padding={5}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >

          <Pressable
          onPress={handleToggleExpanded}
          style={{
            flex: 1,
            flexDirection: "row",
            marginRight: 10,//TODO
            padding: 5,
            justifyContent: "space-between",
            // backgroundColor: theme.backgroundSecondary?.val,
          }}>
            <Text
            color="$text"
            fontSize="$4"
            fontFamily="$bold"
            numberOfLines={isExpanded ? undefined : 1}
            >
              {quest.title}
            </Text>
            <Spacer size={5} />
            <View alignSelf='center'>
            <UpDownIcon color={theme.text?.val} size={18} type={isExpanded ? "up" : "down"} />
            </View>
          </Pressable>
          <CustomSwitch
            value={quest.metadata.status}
            onValueChange={() => onToggleStatus(quest.metadata.id)}
            size={22}
          />
        </View>

        {/* Expanded Content */}
        {isExpanded && (
        <>
            <Spacer size={5} />
            <Separator borderColor="$borderColor" />
            <Spacer size={5} />
            
            <View
            // backgroundColor="$backgroundSecondary"
            padding="$3"//TODO
            >
            {/*  Description and Edit */}
            <View
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
              backgroundColor="$backgroundSecondary"
              padding={5}
              color="$text"
              fontSize="$3"
              fontFamily={"$regular"}
              // borderColor={"$borderColor"}
              // borderWidth={2}
              alignSelf='flex-end'
              width={"90%"}
              flex={1}
              >
                {quest.description ? quest.description : t('quests.noDescription')}
                {/* //TODO */}
              </Text>
              <Spacer size={10} />
              <Pressable onPress={handleEdit}>
                {({ pressed, hovered }) => (
                  <SettingsIcon
                    color={pressed ? theme.headerText?.val : (hovered ? theme.text?.val : theme.borderColor?.val)}
                    colorBackground={theme.backgroundHover?.val}
                    size={26}
                    strokeWidth={12}
                    />
                )}
              </Pressable>
            </View>
            
            <Spacer size={10} />

            {/* Dates */}
            <View
            flexDirection="row"
            justifyContent="space-between"
            >
              {/* Start Date */}
                <View
                backgroundColor="$backgroundSecondary"
                padding={5}
                >
                  <Text color="$text" fontSize="$3" fontFamily="$regular">
                    {t('quests.startDate')}
                    {/* //TODO */}
                  </Text>
                  <Text color="$text" fontSize="$3" fontFamily={"$regular"}>
                    {quest.metadata.startDate
                    ? formatDate(quest.metadata.startDate)
                    : t('quests.noStartDate')}
                    {/* //TODO */}
                  </Text>
                </View>
              {/* Deadline */}
              <View
              backgroundColor="$backgroundSecondary"
              padding={5}
              alignItems='flex-end'
              >
                <Text color="$text" fontSize="$3" fontFamily="$regular">
                  {t('quests.deadline')}
                  {/* //TODO */}
                </Text>
                <Text color="$title" fontSize="$3" fontFamily={"$regular"}>
                  {quest.metadata.deadline
                  ? formatDate(quest.metadata.deadline)
                  : t('quests.noDeadline')}
                  {/* //TODO */}
                </Text>
              </View>
            </View>

            <Spacer size={10} />

            {/* SubQuests */}
            {quest.subQuests && quest.subQuests.length > 0 && (
              <View padding={0} marginBottom={10}>
                {quest.subQuests.map((subQuest, index) => (
                  <View key={index} flexDirection="row" alignItems="center" marginBottom={5} padding={5} backgroundColor="$backgroundSecondary">
                    <Text 
                      color="$text" 
                      fontSize="$3"
                      fontFamily={"$regular"}
                      textDecorationLine={subQuest.completed ? "line-through" : "none"}
                      flex={1}
                      // padding={5}
                      >
                      {subQuest.title}
                    </Text>
                    <CustomSwitch
                      value={subQuest.completed}
                      onValueChange={() => handleSubQuestToggle(index)}
                      size={22}
                      />
                  </View>
                ))}
              </View>
            )}

            {/* Attachments */}
            {quest.attachments && quest.attachments.length > 0 && (
              <View margin={10}>
                <Text color="$text" fontSize="$3" fontWeight="$bold" marginBottom="$2">
                  {t('quests.attachments')} ({quest.attachments.length})
                  {/* //TODO */}
                </Text>
                <View flexDirection="row" flexWrap="wrap">
                  {quest.attachments.map((attachment, index) => renderAttachment(attachment, index))}
                </View>
              </View>
            )}
          </View>
          {/* Reward and share */}
          {quest.metadata.reward ? (
            <XStack justifyContent="space-between" alignItems="flex-start" paddingHorizontal={10}>
              <View width={'15%'} alignItems="flex-start" paddingLeft={10}>
                <Pressable onPress={handleShare}>
                {({ pressed, hovered }) => (
                  <ShareIcon
                    color={pressed ? theme.headerText?.val : (hovered ? theme.text?.val : theme.borderColor?.val)}
                    size={26}
                    />
                )}
              </Pressable>
              </View>
              <View marginBottom={10} alignItems="center">
                <Text color="$text" fontSize="$3" fontFamily="$regular">
                  {t('quests.reward')}
                  {/* //TODO */}
                </Text>
                <Text color="$active" fontSize="$4" fontFamily="$bold">
                  {quest.metadata.reward}
                </Text>
            </View>
            <View width={'15%'}></View>
            </XStack>
          ) : (
            <View marginBottom={10} alignItems="flex-start" paddingLeft={10}>
            <Pressable onPress={handleShare}>
              {({ pressed, hovered }) => (
                <ShareIcon
                  color={pressed ? theme.headerText?.val : (hovered ? theme.text?.val : theme.borderColor?.val)}
                  size={26}
                  />
              )}
            </Pressable>
            </View>
          )}
        </>
        )}
      </View>
    </>
  );
};

export default QuestItem;


// {/* Image Modal */}
// {selectedImage && (
//   <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
//   <Pressable 
//   style={{ 
//               flex: 1, 
//               backgroundColor: 'rgba(0,0,0,0.9)', 
//               justifyContent: 'center', 
//               alignItems: 'center' 
//             }}
//             onPress={() => setSelectedImage(null)}
//           >
//             <Image
//               source={{ uri: selectedImage }}
//               style={{ 
//                 width: '90%', 
//                 height: '80%', 
//                 // resizeMode: 'contain' 
//               }}
//             />
//             <Pressable 
//               style={{ 
//                 position: 'absolute', 
//                 top: 50, 
//                 right: 20, 
//                 backgroundColor: 'rgba(255,255,255,0.8)', 
//                 borderRadius: 20, 
//                 width: 40, 
//                 height: 40, 
//                 justifyContent: 'center', 
//                 alignItems: 'center' 
//               }}
//               onPress={() => setSelectedImage(null)}
//             >
//               <Text style={{ fontSize: 20, fontWeight: 'bold' }}>×</Text>
//             </Pressable>
//           </Pressable>
//         </Modal>
//       )}