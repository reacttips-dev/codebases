// Lifted directly from @atlaskit/flag.

import React from 'react';
import { Button } from '@trello/nachos/button';
import { ActionType, ActionsType } from './types';
import styles from './Flag.less';

interface Props {
  actions: ActionsType;
  testId?: string;
}

export const FlagActions = (props: Props) => {
  const { actions = [], testId } = props;
  if (!actions.length) {
    return null;
  }

  const isLink = (action: ActionType): boolean => action.type === 'link';

  const renderSeparator = (index: number) => {
    if (index === 0) {
      return null;
    }
    return (
      <div className={styles.actionSeparator} key={index + 0.5}>
        {isLink(actions[index - 1]) && isLink(actions[index]) ? '·' : ''}
      </div>
    );
  };

  return (
    <div className={styles.actions} data-testid={testId && `${testId}-actions`}>
      {actions.map((action, index) => [
        renderSeparator(index),
        isLink(action) ? (
          <a
            className={styles.actionLink}
            onClick={action.onClick}
            href={action.href}
            target={action.target}
            key={index}
          >
            {action.content}
          </a>
        ) : (
          <Button onClick={action.onClick} key={index}>
            {action.content}
          </Button>
        ),
      ])}
    </div>
  );
};
