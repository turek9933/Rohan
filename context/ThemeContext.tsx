import { createContext, useContext, useState, useEffect } from 'react';
import { TamaguiProvider, Theme } from '@tamagui/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import config from '@/tamagui.config';

export type ThemeType = 'light' | 'dark' | 'cyber';

export async function saveTheme(theme: string) {
  await AsyncStorage.setItem('theme', theme);
}

export async function getTheme() {
  return await AsyncStorage.getItem('theme');
}

export const ThemeContext = createContext<{
  theme: ThemeType;
  setNewTheme: (theme: ThemeType) => void;
}>({
  theme: 'cyber',
  setNewTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('cyber');

  useEffect(() => {
    getTheme().then(storedTheme => {
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'cyber') {
        setTheme(storedTheme);
      }
    });
  }, []);

  const setNewTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const statusBarStyle = theme === 'light' ? 'dark' : 'light';

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <TamaguiProvider config={config} defaultTheme={theme}>
        <Theme name={theme}>
          <ThemeContext.Provider value={{ theme, setNewTheme }}>
            {children}
          </ThemeContext.Provider>
        </Theme>
      </TamaguiProvider>
    </>
  );
};

export const useTheme = () => useContext(ThemeContext);


