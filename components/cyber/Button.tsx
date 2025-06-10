import { styled } from 'tamagui'
import { Button as TamaguiButton } from '@tamagui/button'

export const Button = styled(TamaguiButton, {
  name: 'Button',

  borderRadius: '$0',
  borderWidth: 5,
  borderColor: '$borderColor',
  backgroundColor: '$background',
  color: '$text',
  fontFamily: '$bold',
  fontSize: '$4',
  letterSpacing: '$1',
  paddingHorizontal: '$6',
  textAlign: 'center',
  minHeight: '$5',
  justifyContent: 'center',
  alignItems: 'center',

  pressStyle: {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColorPress',
    opacity: 0.8,
  },

  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  disabledStyle: {
    opacity: 0.5,
    backgroundColor: '$backgroundStrong',
  },

  variants: {
    loading: {
      true: {
        opacity: 0.8,
        disabled: true,
      }
    }
  }
})