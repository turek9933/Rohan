import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient'

const ThemedBackground = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  const getGradient = () => {
    const a = theme.viewBg1?.val || '#000000';
    const b = theme.viewBg2?.val || '#cccccc';
    const c = theme.viewBg3?.val || '#ffffff';
    return {
        colors: [a, b, c],
        locations: [0.1, 0.8, 1.0],
    }
  };

  const gradient = getGradient();

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
        <ImageBackground
        source={require('@/assets/images/backgroundImage.png')}
        resizeMode="cover"
        style={[
            StyleSheet.absoluteFill,
            {
                width: '100%',
                height: '100%',
                // ...(Platform.OS === 'web' && {
                //     transform: [{ rotate: '90deg' }]
                // })
            }
        ]}        />
        <View style={[
            StyleSheet.absoluteFill,
            {
                mixBlendMode: 'color-burn',
                opacity: 1// Opacity value of the gradient
            }
        ]}>
            <LinearGradient
            colors={gradient.colors}
            locations={gradient.locations}
            style={{ flex: 1 }}
            >
            </LinearGradient>
        </View>
        <View style={{ flex: 1 }}>
            {children}
        </View>
    </View>
  );
}

export default ThemedBackground