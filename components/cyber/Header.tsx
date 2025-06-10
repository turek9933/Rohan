import { Pressable } from 'react-native';
import { View, Text } from 'tamagui';
import BackArrow from '@/components/cyber/BackArrow';
import { useTheme } from 'tamagui';

export default function HeaderCustom({ headerText, back = false, onBackPress = () => {} }: {
    headerText: string;
    back?: boolean;
    onBackPress?: () => void;}) {
    const theme = useTheme();
    const resolvedArrowColor = theme.headerText?.val || '#000';

    return (
    <View
    backgroundColor="$background"
    width="100%"
    paddingTop={0}
    paddingBottom={10}
    paddingHorizontal={16}
    borderBottomWidth={2}
    borderColor="$borderColor"
    position='relative'
    >
            {back && (
                <View
                position="absolute"
                left={16}
                top={8}
                bottom={10}
                justifyContent="center"
                zIndex={1}
                >
                    <Pressable 
                    onPress={onBackPress}
                    >
                        <BackArrow size={36} color={resolvedArrowColor} />
                    </Pressable>
                </View>
            )}
            <Text
            fontSize={'$8'}
            color="$headerText"
            letterSpacing="$1"
            fontFamily="$bold"
            alignSelf='center'
            // backgroundColor="$backgroundSecondary"
            paddingHorizontal={10}
            >
                {headerText || "Header"}
            </Text>
        {/* </XStack> */}
    </View>
    );
}
