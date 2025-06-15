import React from 'react';
import { useTranslation } from 'react-i18next';
import { UniversalSelector } from './UniversalSelector';


export const FontSelector = ({
    selectedFont,
    onFontChange
}: {
    selectedFont: string;
    onFontChange: (font: string) => void;
}) => {
    const { t } = useTranslation();
    const FONTS = [
      { id: 'orbitron', label: t('settings.fonts.orbitron')},
      { id: 'roboto', label: t('settings.fonts.roboto')},
      { id: 'open-sans', label: t('settings.fonts.openSans')},
      { id: 'lato', label: t('settings.fonts.lato')},
      { id: 'montserrat', label: t('settings.fonts.montserrat')},
    ];

  return (
    <UniversalSelector
      value={selectedFont}
      onValueChange={onFontChange}
      options={FONTS}
      placeholder={t('settings.fontPlaceholder')}
      width={200}
    />
  );
};