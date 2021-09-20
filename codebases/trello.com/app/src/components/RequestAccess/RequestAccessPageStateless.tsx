import React from 'react';
import { Spinner } from '@trello/nachos/spinner';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import { TrelloStorage } from '@trello/storage';
import { featureFlagClient } from '@trello/feature-flag-client';
import { identityBaseUrl, siteDomain } from '@trello/config';

import { RequestAccessPageSkeleton } from './RequestAccessPageSkeleton';
import styles from './RequestAccessPageStateless.less';
import { messages } from './messages';
import { RequestAccess } from './RequestAccess';

export enum REQUEST_ACCESS_SCREEN {
  LOADING = 'loading',
  REQUEST_ACCESS_ALLOWED = 'request-access-allowed',
  REQUEST_ACCESS_SUBMITTED = 'request-access-submitted',
}

export interface RequestAccessPageStatelessProps {
  member: {
    id: string;
    fullName: string;
    email: string;
  };
  screen: REQUEST_ACCESS_SCREEN;
  onSubmit: () => void;
  disabled: boolean;
}

export const RequestAccessPageStateless = ({
  disabled,
  member,
  screen,
  onSubmit,
}: RequestAccessPageStatelessProps) => {
  const returnUrl = window.location.pathname;
  const loginParams = new URLSearchParams({
    prompt: 'select_account',
    continue: `${siteDomain}/auth/atlassian/callback?returnUrl=${returnUrl}`,
    application: 'trello',
  }).toString();

  const switchAccountUrl =
    featureFlagClient.get('aa4a.account-switcher', false) &&
    TrelloStorage.get('accountSwitcherAccountAdded')
      ? `${identityBaseUrl}/login?${loginParams}`
      : `/login?reauthenticate=1&returnUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <RequestAccessPageSkeleton>
      {screen === 'loading' && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      {screen === 'request-access-submitted' && (
        <>
          <img
            src={require('resources/images/request-access/header-image.svg')}
            alt=""
            className={styles.headerImage}
          />
          <h1 className={styles.title}>
            {messages['request-access-submitted-title']}
          </h1>
          <p className={styles.description}>
            <CheckCircleIcon size="large" color="green" />
            {messages['request-access-submitted-description']}
          </p>
        </>
      )}
      {screen === 'request-access-allowed' && (
        <>
          <img
            src={require('resources/images/request-access/header-image.svg')}
            alt=""
            className={styles.headerImage}
          />
          <h1 className={styles.title}>{messages['request-access-title']}</h1>
          <RequestAccess
            {...member}
            onSubmit={onSubmit}
            description={messages['request-access-description']}
            switchAccountUrl={switchAccountUrl}
            disabled={disabled}
          />
        </>
      )}
    </RequestAccessPageSkeleton>
  );
};
