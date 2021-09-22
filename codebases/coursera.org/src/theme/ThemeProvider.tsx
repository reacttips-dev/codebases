import React from 'react';

import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';

import { ClientSideEmotionCacheProvider } from '@core/EmotionCacheProvider';
import { Theme } from '@core/types';

import EmotionThemeProvider from './EmotionThemeProvider';
import StylesProvider from './StylesProvider';

type Props = {
  theme: Theme;
};

const ThemeProvider: React.FC<Props> = ({ children, theme }) => {
  return (
    <ClientSideEmotionCacheProvider direction={theme.direction}>
      <MUIThemeProvider theme={theme}>
        <EmotionThemeProvider theme={theme}>
          <StylesProvider>{children}</StylesProvider>
        </EmotionThemeProvider>
      </MUIThemeProvider>
    </ClientSideEmotionCacheProvider>
  );
};

export default ThemeProvider;
