import { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Spacer, Text } from '@tamagui/core';
import { YStack, ScrollView } from 'tamagui';
import { Button } from '@/components/cyber/Button';
import { InputField } from '@/components/cyber/InputField';
import ThemedBox from '@/components/cyber/ThemedBox'
import ThemedBackground from '@/components/cyber/ThemedBackground';
import { useTranslation } from 'react-i18next';
import HeaderCustom from "@/components/cyber/Header";
import { Spinner } from "@/components/cyber/Spinner";


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useAuthContext()!;
  const router = useRouter();
  const { theme } = useTheme();
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useFocusEffect(() => {
    if (user) {
      console.log('[(auth)/login] Login successful. User:\t', user);
      router.replace("/(tabs)");
    }
  });
console.log('LoginScreen loaded');

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError(false);
    
    try {
      const success = await login(email, password);
      setLoginError(!success);
    } catch (error) {
      setLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedBackground>
      <HeaderCustom headerText={t('login.header')} />
      <YStack flex={1}>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
        >
          <YStack 
            flex={1}
            alignItems="center"
            alignSelf="center"
            padding={60}
          >

            <ThemedBox>
            <InputField
              title={t('login.email')}
              placeholder={t('login.emailPlaceholder')}
              isPassword={false}
              value={email}
              onChangeText={setEmail}
              />
            </ThemedBox>

            <Spacer size={20} />

            <ThemedBox>
            <InputField
              title={t('login.password')}
              placeholder={t('login.passwordPlaceholder')}
              isPassword={true}
              value={password}
              onChangeText={setPassword}
              />
            </ThemedBox>

            <Spacer size={20} />
            {loginError && (
              <>
              <Text color="$error" fontSize="$4" fontFamily="$bold" >
                {t('login.error')}
              </Text>
              <Spacer size={10} />
              </>
            )}
            <Button
              onPress={handleLogin}
              minWidth={200}
              loading={isLoading}
              icon={isLoading ? <Spinner /> : null }
              >
              {t('login.login')}
            </Button>
          </YStack>
        </ScrollView>


          <YStack 
          paddingHorizontal={20}
          paddingBottom={40}
          // margin={20} 
          // paddingTop="$4"
          alignItems="center"
          gap={10}
        >
          <Text 
            color="$text"
            fontSize="$3"
            fontFamily="$regular"
            textAlign="center"
            backgroundColor="$background"
            padding={10}
            minWidth={200}
            borderColor="$borderColorSecondary"
            borderWidth={2}
          >
            {t('login.noAccount')}
          </Text>
          
          <Button
            onPress={() => {router.push('/(auth)/register');}}
            minWidth={200}
            borderWidth={2}
            padding={10}
          >
            {t('login.register')}
          </Button>
        </YStack> 

      </YStack>
    </ThemedBackground>
  );
}