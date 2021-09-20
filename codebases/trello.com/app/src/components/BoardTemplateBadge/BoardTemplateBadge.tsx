import React from 'react';
import { forNamespace } from '@trello/i18n';
import classNames from 'classnames';
import styles from './BoardTemplateBadge.less';

const format = forNamespace('board template badge');

interface BoardTemplateBadgeProps {
  dangerous_className?: string;
}

export const BoardTemplateBadge: React.FunctionComponent<BoardTemplateBadgeProps> = ({
  dangerous_className,
}) => {
  return (
    <div
      className={classNames(styles.boardTemplateBadge, dangerous_className)}
      title={format('templates are read-only boards for others to copy')}
    >
      {format('template')}
    </div>
  );
};
