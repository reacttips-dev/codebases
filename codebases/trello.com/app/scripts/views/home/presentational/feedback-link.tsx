import React from 'react';

import classNames from 'classnames';

import { forTemplate } from '@trello/i18n';
const l = forTemplate('home');

import styles from './feedback-link.less';

interface FeedbackLinkProps {
  idMember: string;
  isFloating?: boolean;
  onFeedbackButtonClick?: () => void;
}

export const FeedbackLink: React.FunctionComponent<FeedbackLinkProps> = ({
  idMember,
  isFloating,
  onFeedbackButtonClick,
}) => (
  <a
    className={classNames(
      styles.feedbackLink,
      isFloating ? styles.floating : styles.standard,
    )}
    href={`https://trello.typeform.com/to/mpWwl5?memberid=${idMember}`}
    rel="noopener noreferrer"
    target="_blank"
    onClick={onFeedbackButtonClick}
  >
    <span className={classNames(styles.icon, 'icon-sm', 'icon-information')} />
    <span>{l('feedback')}</span>
  </a>
);
