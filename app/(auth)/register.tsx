import { useState } from "react";
import { Spacer, Text } from '@tamagui/core';
import { YStack, ScrollView } from 'tamagui';
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
// import { useProductContext } from "@/context/ProductContext";
import { auth } from "@/firebase";
import ThemedBox from "@/components/cyber/ThemedBox";
import ThemedBackground from "@/components/cyber/ThemedBackground";
import { Button } from "@/components/cyber/Button";
import { useTranslation } from 'react-i18next';
import HeaderCustom from "@/components/cyber/Header";
import { InputField } from '@/components/cyber/InputField';
import { Alert } from "react-native";
import { Spinner } from "@/components/cyber/Spinner";


export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user, register } = useAuthContext()!;
    const router = useRouter();
    const [registerError, setRegisterError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    // const { addSampleProducts } = useProductContext();

    const handleRegister = async() => {
      setIsLoading(true);
      // Checks if password is not empty and if is confirmed
      if ((password !== confirmPassword || password === '') ||
      (!email.includes('@') || !email.includes('.'))){
        setRegisterError(true);
        setIsLoading(false);
        return;
      }
      try {
        const success = await register(email, password);
        if (!success) {
          setRegisterError(true);
          return;
        }
        
        // const unsubscribe = auth.onAuthStateChanged(async (user) => {
        //   if (user) {
        //     console.log('[(auth)/register.tsx] Wykryto zmiane uzytkownika. User:\t', user);
        //     console.log('[(auth)/register.tsx] Dodawanie przykladowych produktow');
        //     // await addSampleProducts(user.uid);
        //     unsubscribe();
        //   }
        // })
        Alert.alert('Rejestracja', 'Rejestracja przebiegła pomyślnie');
        router.replace("/(auth)/login");
      } catch (error) {
        console.error('[(auth)/register.tsx] Błąd rejestracji:', error);
        setRegisterError(true);
      }
      finally {
        setIsLoading(false);
      }
    }

    return (
    <ThemedBackground>
      <HeaderCustom headerText={t('register.header')} />
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
              title={t('register.email')}
              placeholder={t('register.emailPlaceholder')}
              isPassword={false}
              value={email}
              onChangeText={setEmail}
              />
            </ThemedBox>

            <Spacer size={20} />

            <ThemedBox>
            <InputField
              title={t('register.password')}
              placeholder={t('register.passwordPlaceholder')}
              isPassword={true}
              value={password}
              onChangeText={setPassword}
              />
            </ThemedBox>

            <Spacer size={20} />

            <ThemedBox>
            <InputField
              title={t('register.confirmPassword')}
              placeholder={t('register.confirmPasswordPlaceholder')}
              isPassword={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              />
            </ThemedBox>

            <Spacer size={20} />
            {registerError && (
              <>
              <Text color="$error" fontSize="$4" fontFamily="$bold" >
                {t('register.error')}
              </Text>
              <Spacer size={10} />
              </>
            )}
            <Button
              onPress={handleRegister}
              minWidth={200}
              loading={isLoading}
              icon={isLoading ? <Spinner /> : null }
            >
              {t('register.register')}
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
            {t('register.alreadyHaveAccount')}
          </Text>
          
          <Button
            onPress={() => {router.push('/(auth)/login');}}
            minWidth={200}
            borderWidth={2}
            padding={10}
          >
            {t('register.login')}
          </Button>
        </YStack> 

      </YStack>
    </ThemedBackground>
  );
}