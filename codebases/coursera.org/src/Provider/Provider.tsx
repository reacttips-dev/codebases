import React from 'react';

import I18nProvider from '@core/i18n/I18nProvider';
import useLocale from '@core/i18n/useLocale';
import createTheme from '@core/theme/createTheme';
import ThemeProvider from '@core/theme/ThemeProvider';
import { LanguageCode } from '@core/types';

import SingletonProvider, { SingletonContext } from './SingletonProvider';

export type Props = {
  locale: LanguageCode;
};

const Content: React.FC = ({ children }) => {
  const { direction } = useLocale();
  const theme = createTheme({ direction });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * Setup the CDS theme and i18n for your application.
 * @see [Theming](__storybookUrl__/concepts-theming--page#setup)
 */
const Provider: React.FC<Props> = ({ children, locale }) => (
  <SingletonProvider>
    <SingletonContext.Consumer>
      {(instances) => {
        return instances > 1 ? (
          children
        ) : (
          <I18nProvider locale={locale}>
            <Content>{children}</Content>
          </I18nProvider>
        );
      }}
    </SingletonContext.Consumer>
  </SingletonProvider>
);

export default Provider;
