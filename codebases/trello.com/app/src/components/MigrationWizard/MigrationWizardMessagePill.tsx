import classNames from 'classnames';
import React from 'react';
import { MigrationWizardTestIds } from '@trello/test-ids';
import styles from './MigrationWizardMessagePill.less';

interface MigrationWizardMessagePillProps {
  type: 'error' | 'alert';
}

export const MigrationWizardMessagePill: React.FC<MigrationWizardMessagePillProps> = ({
  children,
  type,
}) => {
  return (
    <div
      data-test-id={MigrationWizardTestIds.ErrorPill}
      role="alert"
      className={classNames(styles.pill, {
        [styles.error]: type === 'error',
        [styles.alert]: type === 'alert',
      })}
    >
      {children}
    </div>
  );
};
