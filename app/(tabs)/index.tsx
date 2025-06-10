import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@/components/cyber/Button';
import ThemedBackground from '@/components/cyber/ThemedBackground';
import { router } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';

export default function TabOneScreen() {
  const { logout } = useAuthContext();
  
  return (
    <ThemedBackground>
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <Button onPress={() => {router.push('/(auth)/login');}}>TO LOGIN</Button>
      <Button onPress={() => {logout()}}>LOGOut pLS</Button>
      <Button onPress={() => {router.push('/(tabs)/help');}}>TO Help</Button>
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
    </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
