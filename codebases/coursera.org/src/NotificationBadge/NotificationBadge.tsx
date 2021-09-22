/** @jsx jsx */

import React from 'react';

import _ from 'lodash';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { BaseComponentProps } from '@core/types';

import getNotificationBadgeCss, { classes } from './getNotificationBadgeCss';

export type Props = {
  /**
   * The content rendered within the badge. The badge is hidden if value is <=0.
   *
   * If the value is capped by the max property, a '+' is added as the final digit.
   */
  value: number;

  /**
   * The maximum value to show. The value is clamped to the range [0,999].
   * @default 99
   */
  max?: number;

  /**
   * If set, inverts the color scheme to white background and dark text
   *
   * @default false
   */
  invert?: boolean;

  /**
   * Vertical badge alignment.
   *
   * @default top
   */
  align?: 'top' | 'inline';

  /**
   * The badge will be added relative to this node.
   */
  children: React.ReactElement | string;
} & BaseComponentProps<'div'>;

const getClampedMax = (max: number) => _.clamp(max, 0, 999);

type BadgeContentProps = { value: number; max: number };
export const BadgeContent: React.FC<BadgeContentProps> = ({
  value,
  max,
}: BadgeContentProps) => {
  const displayValue = value <= max ? value : `${max}+`;
  return (
    <span aria-hidden dir="ltr">
      {displayValue}
    </span>
  );
};

/**
 * Notification badge generates a small badge to the right of its element.
 * For RTL text, the badge sits to the left. Badges can be top or inline aligned.
 *
 * See [Props](__storybookUrl__/data-display-notificationbadge--default#props)
 */
const NotificationBadge = React.forwardRef(function NotificationBadge(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    value,
    children,
    max = 99,
    invert = false,
    align = 'top',
    ...rest
  } = props;

  const clampedMax = React.useMemo(() => getClampedMax(max), [max]);

  return (
    <div ref={ref} css={getNotificationBadgeCss} {...rest}>
      {children}

      {value <= 0 ? null : (
        <span
          className={clsx(classes.content, {
            [classes.default]: !invert,
            [classes.invert]: invert,
            [classes.top]: align === 'top',
            [classes.inline]: align === 'inline',
          })}
        >
          <BadgeContent max={clampedMax} value={value} />
        </span>
      )}
    </div>
  );
});

export default NotificationBadge;
