import { View } from 'tamagui'
import { useTheme } from 'tamagui'

const ThemedBox = (props: any) => {
  const theme = useTheme()
  // Adding opasity=0.6 to imported background color
  const bg = theme.background.val + '99'
  

  return (
    <View
    borderRadius={0}
    borderWidth={0}
    padding={10}
    backgroundColor={bg}
    alignItems="stretch"
    width='100%'
    {...props}
    />
  )
}

export default ThemedBox
