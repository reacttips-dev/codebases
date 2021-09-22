/** @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';

import Grid from '@core/Grid';
import { Actions, ActionsProps } from '@core/notifications/Actions';
import {
  DismissAction,
  DismissActionProps,
} from '@core/notifications/DismissAction';
import { Title } from '@core/notifications/Title';
import useNotificationAriaLabel from '@core/notifications/useNotificationAriaLabel';
import { useTheme } from '@core/theme';
import Typography from '@core/Typography';
import { useId } from '@core/utils';

import { getSiteNotificationCss, severities } from './getSiteNotificationCss';

export type Props = {
  /**
   * Notification title
   */
  title: string;
  /**
   * Notification severity level
   * @default information
   */
  severity?: keyof typeof severities;
  /**
   * Notification content
   */
  children: React.ReactChild;
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
/**
 * Site Notifications are used to notify users about system or product-level
 * notifications not tied to any specific user journey
 *
 * See [Props](__storybookUrl__/feedback-notifications--default#props)
 */
const SiteNotification = React.forwardRef(function SiteNotification(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    id: idFromProps,
    title,
    children,
    primaryAction,
    secondaryAction,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    severity,
    dismissActionProps,
    onDismiss,
    ...rest
  } = props;

  const theme = useTheme();

  const siteNotificationCss = getSiteNotificationCss(theme, props);
  const dismissActionHandler = onDismiss || dismissActionProps?.onClick;

  const ariaLabel = useNotificationAriaLabel(
    severity as NonNullable<keyof typeof severities>,
    title
  );

  const id = useId(idFromProps);
  const titleId = `${id}-title`;
  const contentId = `${id}-content`;

  return (
    <div
      ref={ref}
      aria-describedby={contentId}
      aria-labelledby={titleId}
      css={siteNotificationCss}
      id={id}
      {...rest}
    >
      <Grid
        container
        css={css`
          ${theme.breakpoints.down('xs')} {
            flex-direction: column-reverse;
          }
        `}
        justifyContent="space-between"
        spacing={{ xs: 8, sm: 48 }}
        wrap="nowrap"
      >
        <Grid item>
          <Title
            aria-label={ariaLabel}
            component="h2"
            css={css`
              margin: ${theme.spacing(0, 0, 12)};
            `}
            id={titleId}
          >
            {title}
          </Title>

          <Typography component="div" id={contentId} variant="body1">
            {children}
          </Typography>

          <Actions
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          />
        </Grid>

        {dismissActionHandler && (
          <Grid
            item
            css={css`
              ${theme.breakpoints.down('xs')} {
                align-self: flex-end;
              }
            `}
          >
            <DismissAction
              {...dismissActionProps}
              onClick={dismissActionHandler}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
});

SiteNotification.defaultProps = {
  severity: 'information',
} as Partial<Props>;

export default SiteNotification;
