/* eslint-disable @trello/export-matches-filename */
import React from 'react';
import { Tooltip } from '@trello/nachos/tooltip';
import styles from './ShortcutTooltip.less';
import classNames from 'classnames';

interface ShortcutTooltipProps {
  children: React.ReactNode;
  shortcutText: string;
  shortcutKey: string;
  className?: string;
}

export const ShortcutTooltip: React.FC<ShortcutTooltipProps> = ({
  children,
  shortcutText,
  shortcutKey,
  className,
}) => {
  return (
    <Tooltip
      content={
        <div className={styles.tooltip}>
          <span>{shortcutText}</span>
          <span className={classNames(styles.tooltipShortcut, className)}>
            {shortcutKey}
          </span>
        </div>
      }
      delay={500}
      hideTooltipOnClick
    >
      {children}
    </Tooltip>
  );
};
