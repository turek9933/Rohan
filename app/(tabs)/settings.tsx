import React, { useState } from 'react';
import { YStack, ScrollView, Text, View, Spacer } from 'tamagui';
import { useRouter } from "expo-router";
import ThemedBackground from "@/components/cyber/ThemedBackground";
import { useTranslation } from 'react-i18next';
import HeaderCustom from "@/components/cyber/Header";
import { ThemeSelector } from "@/components/cyber/ThemeSelector";
import { FontSelector } from "@/components/cyber/FontSelector";
import ThemedBox from '@/components/cyber/ThemedBox';
import { Button } from '@/components/cyber/Button';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';
import { UniversalSelector } from '@/components/cyber/UniversalSelector';
import i18n from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

//TODO
import { useCurrentLocation } from '@/hooks/useCurrentLocation';


export default function SettingsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme, setNewTheme } = useTheme();
    const { logout } = useAuthContext();
    
    const [selectedTheme, setSelectedTheme] = useState<ThemeType>(theme || 'cyber');
    const [selectedFont, setSelectedFont] = useState('default');
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
    
    //TODO
    const { location, errorMsg, loading, requestLocation } = useCurrentLocation();
    
    const handleThemeChange = (theme: string) => {
        const result = theme as ThemeType;
        setSelectedTheme(result);
        setNewTheme(result);
    };

    const languageOptions = [
        { id: 'en', label: 'English' },
        { id: 'pl', label: 'Polski' },
    ]

    const handleLanguageChange = async (lang: string) => {
        setSelectedLanguage(lang);
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('language', lang);
    };
    
    const handleFontChange = (font: string) => {
        setSelectedFont(font);
        //TODO: Dodać fonty i ich zmianę
        console.log('Selected font:', font);
    };
    
    const handleLogout = () => {
        logout();
        router.push('/');
    };
    
    const handleHelpPress = () => {
        router.push('/help');
    };
    
    return (
        <ThemedBackground>
        <HeaderCustom 
        headerText={t('settings.header')}
        />

        <YStack flex={1}>
        <ScrollView 
        flex={1}
        showsVerticalScrollIndicator={false}
        >
            <YStack
            flex={1}
            padding={20}
            gap={30}
            >
                {/* Theme selection */}
                <View alignSelf='center'>
                    <ThemedBox alignSelf='center'>
                    <Text
                    fontFamily="$bold"
                    fontSize="$5"
                    color="$text"
                    textAlign="center"
                    >
                        {t('settings.theme')}
                    </Text>
                    </ThemedBox>

                    <Spacer size={10} />

                    <ThemeSelector
                        selectedTheme={selectedTheme}
                        onThemeChange={handleThemeChange}
                    />
                </View>

                {/* Language selection */}

                <View alignSelf='center'>
                    <ThemedBox alignSelf='center'>
                    <Text
                    fontFamily="$bold"
                    fontSize="$5"
                    color="$text"
                    textAlign="center"
                    >
                        {t('settings.language')}
                    </Text>
                    </ThemedBox>

                    <Spacer size={10} />

                    <UniversalSelector
                        value={selectedLanguage}
                        onValueChange={handleLanguageChange}
                        options={languageOptions}
                        placeholder={t('settings.languagePlaceholder')}
                        width={200}
                    />

                </View>


                {/* //TODO */}
                {/* Such a shame */}
                {/* Geolocation */}

                <View alignSelf='center'>
                    <Button
                    onPress={requestLocation}
                    minWidth={200}>
                        <Text fontFamily="$regular" fontSize="$4" color="$text">
                            {t('settings.checkLocation')}
                        </Text>
                    </Button>
                    {errorMsg &&
                        <ThemedBox alignSelf='center'>
                            <Text fontFamily="$regular" fontSize="$4" color="$text" alignSelf='center'>{errorMsg}</Text>
                        </ThemedBox>
                    }
                    {loading &&
                        <ThemedBox alignSelf='center'>
                            <Text fontFamily="$regular" fontSize="$4" color="$text" alignSelf='center'>{t('settings.loading')}</Text>
                        </ThemedBox>
                    }
                    {location && (
                        <ThemedBox gap={10}>
                            <Text fontFamily="$regular" fontSize="$4" color="$text" alignSelf='center'>{t('settings.latitude')}: {location.coords.latitude}</Text>
                            <Text fontFamily="$regular" fontSize="$4" color="$text" alignSelf='center'>{t('settings.longitude')}: {location.coords.longitude}</Text>
                        </ThemedBox>
                    )}
                </View>
                


                {/* Font selection */}
                {/* <View alignSelf='center'>
                    <ThemedBox alignSelf='center'>
                    <Text
                    fontFamily="$bold"
                    fontSize="$5"
                    color="$text"
                    textAlign="center"
                    >
                        {t('settings.fontList')}
                    </Text>
                    </ThemedBox>

                    <Spacer size={10} />

                    <FontSelector
                    selectedFont={selectedFont}
                    onFontChange={handleFontChange}
                    />
                </View> */}

                <View alignSelf='center'>
                    <Button
                    onPress={handleHelpPress}
                    minWidth={200}
                    borderWidth={4}
                    // iconAfter={<Text fontFamily={"$bold"} borderWidth={2} borderColor={"$borderColor"} width={26} height={26} paddingVertical={3} justifyContent='center' alignItems='center' color="$borderColor">?</Text>}
                    >
                    <Text fontFamily="$regular" fontSize="$4" color="$text">
                        {t('settings.help')}
                    </Text>
                    </Button>
                    
                    <Spacer size={30} />

                    <Button
                    onPress={handleLogout}
                    minWidth={200}
                    >
                    <Text fontFamily="$regular" fontSize="$4" color="$text">
                        {t('settings.logout')}
                    </Text>
                    </Button>
                </View>
            </YStack>
        </ScrollView>
        </YStack>
    </ThemedBackground>
    );
}