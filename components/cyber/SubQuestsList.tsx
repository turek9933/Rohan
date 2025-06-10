import { SubQuest } from "@/types/Quest";
import { Text, XStack, YStack, View, useTheme } from "tamagui";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/cyber/Button";
import { InputField } from "@/components/cyber/InputField";
import AddIcon from "@/components/cyber/AddIcon";
import { Pressable } from "react-native";
import ThemedBox from "@/components/cyber/ThemedBox";

export function SubQuestsList({ subQuests, onChange } : {
  subQuests: SubQuest[];
  onChange: (subQuests: SubQuest[]) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleAdd = () => {
    onChange([...subQuests, { title: '', completed: false }]);
  };

  const handleRemove = (index: number) => {
    onChange(subQuests.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, newTitle: string) => {
    onChange(
      subQuests.map((sq, i) => i === index ? { ...sq, title: newTitle } : sq)
    );
  };

  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <Text
        fontFamily="$bold"
        fontSize="$4"
        color="$text"
        paddingHorizontal={10}
        >
          {t('add.subquests')}
        </Text>
        <Pressable onPress={handleAdd}>
          {({ pressed, hovered }) => (
            <ThemedBox padding={0}>
              <AddIcon
                color={pressed ? theme.headerText?.val : ( hovered ? theme.text?.val : theme.borderColor?.val )}
                colorBackground={theme.backgroundHover?.val}
                size={36}
                strokeWidth={10}
                transparentBackground={!hovered}
              />
            </ThemedBox>
          )}
        </Pressable>
      </XStack>
      
      {subQuests.map((subQuest, index) => (
        <XStack key={index} gap="$2" alignItems="flex-end">
          <View flex={1}>
            <InputField
              title=""
              placeholder={t('add.subquestPlaceholder')}
              value={subQuest.title}
              onChangeText={(text) => handleChange(index, text)}
            />
          </View>
          <Button
            onPress={() => handleRemove(index)}
            padding={"$2"}
          >
            X
          </Button>
        </XStack>
      ))}
    </YStack>
  );
}