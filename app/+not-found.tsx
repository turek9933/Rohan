import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text } from 'tamagui';

import ThemedBox from '@/components/cyber/ThemedBox';
import ThemedBackground from '@/components/cyber/ThemedBackground';
import HeaderCustom from '@/components/cyber/Header';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/cyber/Button';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedBackground>
        <HeaderCustom headerText={t('notFound.header', "Page Not Found")} back={true} onBackPress={() => router.push('/(auth)/login')} />
        <ThemedBox style={{ marginTop: 20, marginBottom: 20 }}>
          <Text fontFamily='$bold' fontSize={24} textAlign='center' color='$text'>
            {t('notFound.message', "The page you're looking for doesn't exist.")}
          </Text>
        </ThemedBox>

        <Button onPress={() => {router.push('/(auth)/login');}}>{t('notFound.back', "Back to Home")}</Button>
      </ThemedBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
