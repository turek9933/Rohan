import { Tabs,  } from 'expo-router';
import { useTheme, useThemeName } from 'tamagui';
import AddIcon from '@/components/cyber/AddIcon';
import HomeIcon from '@/components/cyber/HomeIcon';
import SettingsIcon from '@/components/cyber/SettingsIcon';
import { Platform } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();
  const themeName = useThemeName();

 function getTabIcon(name: 'home' | 'add' | 'settings', focused: boolean, color: string) {
  const size = 50;
  const colorBackground = theme.tabIconBackground?.val ?? '#fff';

  const iconProps = {
    color,
    colorBackground,
    size,
  };

  if (name === 'add') {
    return <AddIcon {...iconProps}/>
  } else if (name === 'home') {
    return <HomeIcon {...iconProps}/>
  } else if (name === 'settings') {
    return <SettingsIcon {...iconProps}/>
  } else {
    console.log('name: ', name);
    return null;
  }
}

  return (
    <Tabs
      key={themeName}
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: { display: 'none'},
        tabBarActiveTintColor: theme.tabIconActive?.val ?? '#007AFF',
        tabBarInactiveTintColor: theme.tabIcon?.val ?? '#8E8E93',
        tabBarStyle: {
          backgroundColor: theme.tabIconBackground?.val ?? 'cyan',
          height: 70,
          paddingBottom: Platform.OS === 'web' ? 5 : 0,
          paddingTop: 0,
          paddingHorizontal: 20,
          borderTopWidth: 0
        },
        tabBarLabelPosition: 'beside-icon',
        tabBarIconStyle:{
          flex:1,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          width: 50,
          height: 50
        },
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => getTabIcon('settings', focused, color),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => getTabIcon('home', focused, color),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Dodaj',
          tabBarIcon: ({ color, focused }) => getTabIcon('add', focused, color),
        }}
      />

      {/* Ekrany ukryte */}
      <Tabs.Screen
        name="help"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      {/* <Tabs.Screen
        name="edit"
        options={{
          href: null,
          headerShown: true,
        }}
      /> */}
      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
        
      />
    </Tabs>
  );
}
