import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
// eslint-disable-next-line no-duplicate-imports
import type { StringSubstitutions } from '@trello/i18n';
import React from 'react';

import styles from './PopoverConfirm.less';

export interface PopoverConfirmProps {
  confirmKey: string;
  confirmCallback: React.MouseEventHandler;
  confirmSubstitutions?: StringSubstitutions;
  isDanger?: boolean;
}

export const PopoverConfirm: React.FunctionComponent<PopoverConfirmProps> = ({
  confirmKey,
  confirmCallback,
  confirmSubstitutions,
  isDanger,
}) => {
  const format = forNamespace(['confirm', confirmKey]);

  return (
    <div className={styles.confirmContainer}>
      <p>{format('text', confirmSubstitutions)}</p>

      <Button
        appearance={isDanger ? 'danger' : 'primary'}
        autoFocus
        onClick={confirmCallback}
        size="fullwidth"
      >
        {format('confirm', confirmSubstitutions)}
      </Button>
    </div>
  );
};
