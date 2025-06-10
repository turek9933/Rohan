import { createFont, createTamagui } from '@tamagui/core'
import { config as configBase } from '@tamagui/config/v3'

const cyberTheme = {
  white: '#FFFFFF',
  black: '#000000',
  
  redDark: '#7A0B0B',
  red: '#A50C0C',
  gold: '#EBB862',
  yellow: '#F5FCD3',
  blue: '#00F7FF',
  green: '#36AF04',

  headerText: '#00F7FF',
  title: '#EBB862',
  text: '#F5FCD3',
  active: '#00F7FF',
  background: '#7A0B0B',
  backgroundSecondary: '#A50C0C',
  borderColor: '#EBB862',
  borderColorSecondary: '#A50C0C',
  error: '#F5FCD3',
  
  backgroundHover: '#A50C0C',
  borderColorHover: '#F5FCD3',
  backgroundPress: '#A50C0C',
  borderColorPress: '#00F7FF',

  viewBg1: '#A50C0C',
  viewBg2: '#7A0B0B',
  viewBg3: '#000000',

  tabIcon: '#A50C0C',
  tabIconActive: '#00F7FF',
  tabIconBackground: '#7A0B0B',

  x: '#36AF04'
}

//TODO
const lightTheme = {
  white: '#ffffff',
  black: '#000000',

  whiteLightTheme: '#EBEDF0',
  gray: '#CDD3D9',
  khaki: '#7B841F',
  blue: '#458E95',
  purple: '#8F3886',
  green: '#519F1D',

  headerText: '#8F3886',
  title: '#7B841F',
  text: '#458E95',
  active: '#8F3886',
  background: '#EBEDF0',
  backgroundSecondary: '#CDD3D9',
  borderColor: '#7B841F',
  borderColorSecondary: '#CDD3D9',
  error: '#458E95',
  
  backgroundHover: '#CDD3D9',
  borderColorHover: '#458E95',
  backgroundPress: '#CDD3D9',
  borderColorPress: '#8F3886',

  viewBg1: '#EBEDF0',
  viewBg2: '#CDD3D9',
  viewBg3: '#000000',
  
  tabIcon: '#CDD3D9',
  tabIconActive: '#8F3886',
  tabIconBackground: '#EBEDF0',

  x: '#519F1D'
}

//TODO
const darkTheme = {
  white: '#FFFFFF',
  black: '#000000',

  blackDarkTheme: '#020F21',
  navy: '#062653',
  limon: '#D2F69C',
  gray: '#CFE2FC',
  pink: '#F1558E',
  green: '#5ED467',

  headerText: '#F1558E',
  title: '#D2F69C',
  text: '#CFE2FC',
  active: '#F1558E',
  background: '#020F21',
  backgroundSecondary: '#062653',
  borderColor: '#D2F69C',
  borderColorSecondary: '#062653',
  error: '#CFE2FC',
  
  backgroundHover: '#062653',
  borderColorHover: '#CFE2FC',
  backgroundPress: '#062653',
  borderColorPress: '#F1558E',

  viewBg1: '#062653',
  viewBg2: '#020F21',
  viewBg3: '#ffffff',

  tabIcon: '#062653',
  tabIconActive: '#F1558E',
  tabIconBackground: '#020F21',

  x: '#5ED467'
}

const RegularFont = createFont({
  family: 'Orbitron-Regular',
      size: {
        1: 8,
        2: 10,
        3: 12,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 24,
        9: 30,
        10: 42,
      },
      lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 22,
        5: 24,
        6: 28,
        7: 32,
        8: 36,
        9: 40,
        10: 46,
      },
      letterSpacing: {
        1: 0,
        2: -0.5,
        3: 1,
        4: 1.5,
        5: 2,
        6: 2.5,
        7: 3,
      },
});
const BoldFont = createFont({
  family: 'Orbitron-Bold',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 42,
  },
  lineHeight: {
    1: 20,
    2: 22,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 40,
    8: 46,
    9: 50,
    10: 56,
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: 1,
    4: 1.5,
    5: 2,
    6: 2.5,
    7: 3,
  },
});
const BlackFont = createFont({
  family: 'Orbitron-Black',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 42,
  },
  lineHeight: {
    1: 20,
    2: 22,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 40,
    8: 46,
    9: 50,
    10: 56,
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: 1,
    4: 1.5,
    5: 2,
    6: 2.5,
    7: 3,
  },
});

const config = createTamagui({
  ...configBase,
  themes: {
    ...configBase.themes,
    cyber: cyberTheme,
    light: lightTheme,
    dark: darkTheme,
  },
  tokens: {
    ...configBase.tokens,
    // No rounding
    radius: {
      ...configBase.tokens.radius,
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    },
    space: {
      ...configBase.tokens.space,
      '$1': 4,
      '$2': 8,
      '$3': 12,
      '$4': 16,
      '$5': 20,
      '$6': 24,
    }
  },
fonts: {
    ...configBase.fonts,

    regular: RegularFont,
    bold: BoldFont,
    black: BlackFont//TODO NOT WORKING DONOT USE
  },
})

export type AppConfig = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config