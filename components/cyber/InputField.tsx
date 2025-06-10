import React from 'react';
import { Input, View, Label, XStack, YStack, styled } from 'tamagui';

export const InputField = ({
  title,
  placeholder,
  isPassword = false,
  value,
  onChangeText,
  minInputHeight,
  multiline = false,
  inputMode = 'text',
  keyboardType = 'default',
  onlyNumbers = false
}: {
  title?: string;
  placeholder?: string;
  isPassword?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  minInputHeight?: number;
  multiline?: boolean
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  onlyNumbers?: boolean
}) => {
  //How the hell there is not prop for that!?!
  const handleTextChange = (text: string) => {
    if (onlyNumbers) {
      const numbersOnly = text.replace(/[^0-9]/g, '');
      onChangeText?.(numbersOnly);
    } else {
      onChangeText?.(text);
    }
  };
  return (
    <YStack margin={0} gap={10} width={'100%'} minWidth={300}>
      {title && (
        <View
          backgroundColor={'$background'}
        >
        <Label 
          htmlFor={title} 
          fontFamily="$bold"
          fontSize="$4"
          lineHeight={'$4'}
          color="$text"
          letterSpacing="$1"
          margin={0}
          alignSelf='center'
          // justifyContent='center'
          // width='100%'
          >
          {title}
        </Label>
        </View>
      )}
      <Input
        placeholder={placeholder || title}
        placeholderTextColor="$text"
        secureTextEntry={isPassword && !multiline}
        value={value}
        inputMode={inputMode}
        keyboardType={keyboardType}

        onChangeText={handleTextChange}
        borderRadius={0}
        borderWidth={5}
        borderColor="$borderColor"
        backgroundColor="$background"
        color="$text"
        fontFamily="$regular"
        fontSize="$4"
        lineHeight={'$4'}
        outlineWidth={0}
        alignSelf='center'
        width='100%'
        minWidth={300}
        multiline={multiline}
        height={multiline ? undefined : '$5'}
        minHeight={multiline ? (minInputHeight ?? 100) : undefined}
      />
    </YStack>
  );
}