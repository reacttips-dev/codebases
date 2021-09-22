/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { NotificationSeverity } from '@core/notifications/types';
import { useTheme } from '@core/theme';
import Typography, { TypographyProps } from '@core/Typography';

import getTitleCss from './getTitleCss';

export type TitleProps = {
  /**
   * Text to display as the title for the notification
   */
  children?: string;
  /**
   * Severity type of Notification
   * @default information
   */
  severity?: NotificationSeverity;
} & Omit<TypographyProps, 'color' | 'variant'>;

const Title = (props: TitleProps): React.ReactElement<TitleProps> | null => {
  const { children, severity, ...rest } = props;
  const theme = useTheme();
  const titleCss = getTitleCss(theme, severity);

  if (!children) {
    return null;
  }

  return (
    <Typography variant="h3bold" {...rest} css={titleCss}>
      {children}
    </Typography>
  );
};

export default Title;
