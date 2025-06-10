import { View, Text } from 'tamagui';

const CustomRadioButton = ({
    isSelected, 
    onPress 
    } : { 
    isSelected: boolean;
    onPress: () => void
    }) => (
    <View
        width={40}
        height={40}
        borderWidth={4}
        borderColor="$borderColor"
        borderRadius={0}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
        pressStyle={{
            backgroundColor: isSelected ? "$background" : "$backgroundSecondary",
            borderColor: "$text"
        }}
        onPress={onPress}
    >
        {isSelected && (
        <Text
            color="$x"
            fontSize="$7"
            fontWeight="bold"
            textAlign='center'
            lineHeight="$7"
            includeFontPadding={false}
        >
            X
        </Text>
        )}
    </View>
);

export default CustomRadioButton