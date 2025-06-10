import { createContext, useContext, useState } from 'react';
import { TamaguiProvider, Theme } from '@tamagui/core';
import config from '@/tamagui.config';

export type ThemeType = 'light' | 'dark' | 'cyber';

export const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}>({
  theme: 'cyber',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('cyber');

  return (
    <TamaguiProvider config={config}>
      <Theme name={theme}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          {children}
        </ThemeContext.Provider>
      </Theme>
    </TamaguiProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);


