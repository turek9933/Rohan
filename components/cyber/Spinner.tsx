import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'tamagui'

export const Spinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current
  const theme = useTheme()

  useEffect(() => {
    const spinAnim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    )
    spinAnim.start()
    return () => spinAnim.stop()
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View
      style={[
        {
          width: 16,
          height: 16,
          borderWidth: 2,
          borderRadius: 0,
          borderColor: theme.text?.val,
          backgroundColor: 'transparent',
        },
        { transform: [{ rotate: spin }] },
      ]}
    />
  )
}