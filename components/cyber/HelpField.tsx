import React from 'react';
import { View, Text, YStack } from 'tamagui';

export const HelpField = ({
  title,
  body,
  alignSelf='flex-start',
}: {
  title: string;
  body: string;
  alignSelf?: 'flex-start' | 'flex-end';
}) => {
const startAlign = alignSelf === 'flex-start';
return (
    <YStack
    margin={0}
    gap={10}
    width={'100%'}
    minWidth={300}
    alignItems={startAlign ? 'flex-start' : 'flex-end'}
    >
        {title && (
            <View
            backgroundColor={'$background'}
            width={'75%'}
            alignSelf={startAlign ? 'flex-start' : 'flex-end'}
            >
            <Text 
            htmlFor={title} 
            fontFamily="$bold"
            fontSize="$4"
            lineHeight={'$4'}
            color="$text"
            letterSpacing="$1"
            margin={0}
            padding={10}
            borderWidth={2}
            borderColor='$borderColorSecondary'
            width='100%'
            textAlign={startAlign ? 'left' : 'right'}
            >
                {title}
            </Text>
            </View>
        )}
        {body && (
            <View
            backgroundColor={'$background'}
            width={'75%'}
            alignSelf={startAlign ? 'flex-start' : 'flex-end'}
            >
            <Text 
            htmlFor={body} 
            fontFamily="$regular"
            fontSize="$4"
            lineHeight={'$4'}
            color="$text"
            letterSpacing="$1"
            margin={0}
            padding={10}
            alignSelf='center'
            borderWidth={2}
            borderColor='$borderColorSecondary'
            width='100%'
            textAlign={startAlign ? 'left' : 'right'}
            >
                {body}
            </Text>
            </View>
        )}
    </YStack>
  );
}