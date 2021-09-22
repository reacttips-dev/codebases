import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

import { Props as LocalNotificationProps } from './LocalNotification';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('localNotification', [
  'inlineAction',
  'content',
  'inlineActionContainer',
]);

export const severities = {
  information: (theme: Theme): SerializedStyles => css`
    background: ${theme.palette.blue[50]};
  `,
  success: (theme: Theme): SerializedStyles => css`
    background: ${theme.palette.green[50]};
  `,
  error: (theme: Theme): SerializedStyles => css`
    background: ${theme.palette.red[50]};
  `,
  warning: (theme: Theme): SerializedStyles => css`
    background: ${theme.palette.yellow[50]};
  `,
};

export const severityColor = {
  information: (theme: Theme): string => theme.palette.blue[600],
  success: (theme: Theme): string => theme.palette.green[700],
  error: (theme: Theme): string => theme.palette.red[700],
  warning: (theme: Theme): string => theme.palette.yellow[800],
};

export const areDismissAndInlineActionPresent = (
  props: Partial<LocalNotificationProps>
): boolean =>
  Boolean(
    (props.onDismiss || props.dismissActionProps?.onClick) && props.inlineAction
  );

export const getLocalNotificationCss = (
  theme: Theme,
  props: LocalNotificationProps
): SerializedStyles => css`
  display: flex;
  padding: ${theme.spacing(12, 16)};
  border-left: 4px solid ${severityColor[props.severity](theme)};
  border-radius: 2px;
  ${severities[props.severity as NonNullable<keyof typeof severities>](theme)};

  ${classNames.content} {
    align-items: ${areDismissAndInlineActionPresent(props)
      ? 'center'
      : 'stretch'};
    display: inline-flex;
    justify-content: space-between;
    margin: ${theme.spacing(0, 0, 0, 12)};
    flex: auto;

    ${theme.breakpoints.down('xs')} {
      flex-direction: column-reverse;
      margin: 0;
    }
  }

  ${classNames.inlineAction} {
    ${theme.breakpoints.down('sm')} {
      display: none;
    }

    margin-right: 16px;
  }

  ${classNames.inlineActionContainer} {
    flex: none;
    margin-left: ${theme.spacing(48)};

    ${theme.breakpoints.down('sm')} {
      align-self: flex-start;
      margin-left: ${theme.spacing(24)};
    }

    ${theme.breakpoints.down('xs')} {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin: ${theme.spacing(0, 0, 12, 0)};
      width: 100%;
      min-height: 36px;
    }

    & > button:last-of-type {
      margin-right: -8px;
    }
  }
`;
