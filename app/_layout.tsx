import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/i18n'
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { QuestProvider } from '@/context/QuestContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { styled } from '@tamagui/core';
import { PortalProvider } from 'tamagui';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Orbitron-Regular': require('../assets/fonts/Orbitron-Regular.ttf'),
    'Orbitron-Bold': require('../assets/fonts/Orbitron-Bold.ttf'),
    'Orbitron-Black': require('../assets/fonts/Orbitron-Black.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <StyledSafeAreaView >
        <I18nextProvider i18n={i18n}>
          <PortalProvider>
            <AuthProvider>
              <QuestProvider>
                <RootLayoutNav />
              </QuestProvider>
            </AuthProvider>
          </PortalProvider>
        </I18nextProvider>
      </StyledSafeAreaView>
    </ThemeProvider>
  );
}

const StyledSafeAreaView = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '$background',
});

function RootLayoutNav() {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    if (loading) return;
    const isAuthPage = pathname.startsWith('/(auth)');
    const isTabsPage = pathname.startsWith('/(tabs)');
    
    if (!user && !isAuthPage) {
      router.replace('/(auth)/login');
    } else if (user && isAuthPage) {
      router.replace('/(tabs)');
    }
    
  }, [user, loading, pathname, router]);
  
  if (loading) return null;
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} redirect={true} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
