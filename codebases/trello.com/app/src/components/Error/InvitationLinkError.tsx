import React from 'react';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';

// eslint-disable-next-line @trello/less-matches-component
import styles from './Error.less';

const format = forTemplate('error');

interface InvitationLinkErrorProps {
  messageKey: string;
}

export const InvitationLinkError: React.FunctionComponent<InvitationLinkErrorProps> = ({
  messageKey,
}) => (
  <div className={cx(styles.bigMessage, styles.quiet)}>
    <h1>{format(messageKey)}</h1>
    <p>{format('ask-for-a-new-link')}</p>
  </div>
);
