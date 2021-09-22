import React from 'react';

import { ThemeProvider } from '@emotion/react';

import { Theme } from '@core/types';

const EmotionThemeProvider: React.FC<{
  theme: Theme;
}> = ({ theme, children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default EmotionThemeProvider;
