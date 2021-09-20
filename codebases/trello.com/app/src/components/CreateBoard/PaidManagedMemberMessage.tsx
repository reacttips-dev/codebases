/* eslint-disable import/no-default-export,@trello/export-matches-filename */
import React from 'react';
import classNames from 'classnames';
import styles from './PaidManagedMemberMessage.less';
import { forTemplate } from '@trello/i18n';
import { featureFlagClient } from '@trello/feature-flag-client';

export interface PaidManagedMemberMessageProps {
  containerClass?: string;
  text?: string;
}

const format = forTemplate('create_board');

const PaidManagedMemberMessage = ({
  containerClass,
  text,
}: PaidManagedMemberMessageProps) => {
  const blockTeamlessBoardsEnabled = featureFlagClient.get(
    'btg.block-teamless-boards',
    false,
  );
  const messaging = blockTeamlessBoardsEnabled
    ? format('enterprise-member-messaging')
    : format('boards can only');
  return (
    <div className={classNames(styles.pmmmContainer, containerClass)}>
      <p>{text || messaging}</p>
    </div>
  );
};

export default PaidManagedMemberMessage;
