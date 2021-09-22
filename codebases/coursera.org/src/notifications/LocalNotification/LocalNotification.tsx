/** @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';

import Button, { ButtonProps } from '@core/Button';
import Hidden from '@core/Hidden';
import { Actions, ActionsProps } from '@core/notifications/Actions';
import {
  DismissAction,
  DismissActionProps,
} from '@core/notifications/DismissAction';
import { SeverityIcon } from '@core/notifications/SeverityIcon';
import { Title, TitleProps } from '@core/notifications/Title';
import { NotificationSeverity } from '@core/notifications/types';
import useNotificationAriaLabel from '@core/notifications/useNotificationAriaLabel';
import { useTheme } from '@core/theme';
import Typography from '@core/Typography';
import { useId } from '@core/utils';
import VisuallyHidden from '@core/VisuallyHidden';

import { getLocalNotificationCss, classes } from './getLocalNotificationCss';

export type Props = {
  titleProps?: TitleProps;
  /**
   * Severity type of Notification
   */
  severity: NotificationSeverity;
  /**
   * Notification content
   */
  children: React.ReactChild;
  /**
   * Inline action
   */
  inlineAction?: React.ReactElement<ButtonProps, typeof Button>;
  /**
   * Callback fired when dismiss button is clicked.
   * Dismiss button only appears if either onDismiss function or
   * onClick function within dismissActionProps is provided.
   */
  onDismiss?: () => void;
  /**
   * Provide any additional props to the dismiss action.
   * Use it to adjust the text or provide an `aria-*` property to the dismiss action.
   */
  dismissActionProps?: DismissActionProps;
} & ActionsProps &
  React.ComponentPropsWithRef<'div'>;

const LocalNotification = React.forwardRef(function LocalNotification(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    id: idFromProps,
    titleProps,
    children,
    primaryAction,
    secondaryAction,
    inlineAction,
    severity,
    onDismiss,
    dismissActionProps,
    ...rest
  } = props;

  const id = useId(idFromProps);
  const ariaLabel = useNotificationAriaLabel(severity, titleProps?.children);
  const titleId = titleProps?.children ? `${id}-title` : undefined;
  const contentId = `${id}-content`;

  const theme = useTheme();
  const localNotificationCss = getLocalNotificationCss(theme, props);
  const dismissActionHandler = onDismiss
    ? onDismiss
    : dismissActionProps?.onClick;

  return (
    <div
      ref={ref}
      aria-describedby={titleProps?.children ? contentId : undefined}
      aria-labelledby={titleProps?.children ? titleId : contentId}
      css={localNotificationCss}
      id={id}
      {...rest}
    >
      <Hidden xsDown>
        <SeverityIcon severity={severity} />
      </Hidden>

      <div className={classes.content}>
        <div>
          <Title aria-label={ariaLabel} id={titleId} {...titleProps} />
          <Typography component="div" id={contentId} variant="body1">
            {titleProps?.children === undefined && (
              <VisuallyHidden>{ariaLabel}</VisuallyHidden>
            )}
            {children}
          </Typography>

          {inlineAction && (
            <Hidden
              mdUp
              css={css`
                margin-left: -8px;
                margin-top: ${theme.spacing(24)};
              `}
            >
              {inlineAction}
            </Hidden>
          )}

          <Actions
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          />
        </div>

        <div className={classes.inlineActionContainer}>
          <Hidden smUp>
            <SeverityIcon severity={severity} />
          </Hidden>

          {inlineAction &&
            React.cloneElement(inlineAction, {
              className: classes.inlineAction,
            })}

          {dismissActionHandler && (
            <DismissAction
              {...dismissActionProps}
              onClick={dismissActionHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default LocalNotification;
