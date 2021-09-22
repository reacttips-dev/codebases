import React from 'react';

import { I18nProvider as ReactAriaI18nProvider } from '@react-aria/i18n';

import { getStandardizedLocale } from '@core/i18n';
import { LanguageCode } from '@core/types';

type Props = {
  locale: LanguageCode;
  children: React.ReactNode;
};

/**
 * Provides the locale for the application to all child components.
 */
const I18nProvider = ({
  locale,
  children,
}: Props): React.ReactElement<Props> => {
  const standardizedLocale = getStandardizedLocale(locale);

  return (
    <ReactAriaI18nProvider locale={standardizedLocale}>
      {children}
    </ReactAriaI18nProvider>
  );
};

export default I18nProvider;
