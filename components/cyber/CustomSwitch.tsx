import { Button, Text, AnimatePresence } from 'tamagui'
import { useState } from 'react'

const CustomSwitch = ({ 
  value,
  onValueChange,
  size = 40,
}: {
  value: boolean
  onValueChange: (newValue: boolean) => void
  size?: number
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = () => {
    onValueChange(!value)
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
  }

  return (
    <Button
      width={size}
      height={size}
      borderWidth={4}
      borderColor={value ? "$text" : '$borderColor'}
      borderRadius={0}
      backgroundColor={value ? "$backgroundSecondary" : '$background'}
      alignItems="center"
      justifyContent="center"
      pressStyle={{
        borderColor: '$active',
        scale: 0.9,
      }}
      onPress={handlePress}
      hoverStyle={{ 
        scale: 1.08,
        borderColor: '$title'  
      }}
      animation="bouncy"
      unstyled
    >
      <AnimatePresence>
        {value && (
          <Text
            key="x-mark"
            color="$x"
            fontSize="$7"
            fontWeight="bold"
            textAlign="center"
            lineHeight="$7"
            includeFontPadding={false}


            enterStyle={{ 
              opacity: 0, 
              scale: 0.4,
              rotateZ: '-30deg',
              x: -80,
              y: 60,
              color: '$title'
            }}

            exitStyle={{ 
              opacity: 0, 
              scale: 1.6,
              rotateZ: '30deg',
              x: 10,
              y: -10,
              color: '$title'
            }}

            animation="superBouncy"
          >
            X
          </Text>
        )}
      </AnimatePresence>
    </Button>
  )
}

export default CustomSwitch