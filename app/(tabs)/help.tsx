import { Spacer } from '@tamagui/core';
import { YStack, ScrollView } from 'tamagui';
import { useRouter } from "expo-router";
import ThemedBackground from "@/components/cyber/ThemedBackground";
import { useTranslation } from 'react-i18next';
import HeaderCustom from "@/components/cyber/Header";
import { HelpField } from '@/components/cyber/HelpField';

const HELP_TIPS_COUNT = 2;//TODO

export default function HelpScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const helpTips = Array.from(Array(HELP_TIPS_COUNT).keys());

    return (
    <ThemedBackground>
        <HeaderCustom headerText={t('help.header')} back={true} onBackPress={() => router.back()} />

        <YStack flex={1}>
        <ScrollView 
        flex={1}
        showsVerticalScrollIndicator={false}
        >
            <YStack
            flex={1}
            padding={20}
            gap={20}
            >
                {helpTips.map((tipsNumber, index) => {
                    const isEven = index % 2 === 0;
                    const aligment = isEven ? 'flex-start' : 'flex-end';
                    return (
                        <HelpField
                        key={tipsNumber}
                        title={t(`help.tip${tipsNumber + 1}_Header`)}
                        body={t(`help.tip${tipsNumber + 1}_Body`)}
                        alignSelf={aligment}
                        />
                    );
                })}

                <HelpField
                title={t('help.tip1_Header')}
                body={t('help.tip1_Body')}
                />
                <Spacer size={20} />

                {/* <HelpField
                title={t('help.tip2_Header')}
                body={t('help.tip2_Body')}
                />

                <Spacer size={20} /> */}
            </YStack>
        </ScrollView>
        </YStack>
    </ThemedBackground>
  );
}