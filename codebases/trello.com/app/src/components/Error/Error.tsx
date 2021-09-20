import React, { useEffect } from 'react';
import cx from 'classnames';
import { memberId } from '@trello/session-cookie';
import { forTemplate } from '@trello/i18n';
import { l } from 'app/scripts/lib/localize';
import { Controller } from 'app/scripts/controller';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { useErrorQuery } from './ErrorQuery.generated';
import { ErrorProps } from './Error.types';
import { UnconfirmedModelError } from './UnconfirmedModelError';
import { NormalError } from './NormalError';
import { InvitationLinkError } from './InvitationLinkError';
import {
  useRequestAccessPage,
  RequestAccessErrorHandler,
  RequestAccessPage,
} from 'app/src/components/RequestAccess';

import styles from './Error.less';

const format = forTemplate('error');

export const Error: React.FunctionComponent<ErrorProps> = ({
  errorType = 'notFound',
  reason,
}) => {
  const { data } = useErrorQuery();
  const isLoggedIn = !!memberId;
  const fullName = data?.member?.fullName || '';
  const email = data?.member?.email || '';

  useEffect(() => {
    Controller.setViewType('error');
    Controller.focusContent();
    Controller.setLocation({
      title: l('error'),
      location: undefined,
      options: undefined,
    });
  }, []);

  const messageKeys: { [key: string]: string[] } = {
    notFound: [
      'page-not-found',
      'this-page-may-be-private-you-may-be-able-to-view-it-by-logging-in',
      'this-page-may-be-private-if-someone-gave-you-this-link-they-may-need-to-invite-you-to-one-of-their-boards-or-organizations',
    ],
    boardNotFound: [
      'board-not-found',
      'this-board-may-be-private-you-may-be-able-to-view-it-by-logging-in',
      'this-board-may-be-private-if-someone-gave-you-this-link-they-may-need-to-invite-you-to-one-of-their-boards-or-organizations',
    ],
    notPermissionsToSeeBoard: [
      'you-dont-have-permission-to-see-this-board',
      'this-page-may-be-private-you-may-be-able-to-view-it-by-logging-in',
      'this-page-may-be-private-if-someone-gave-you-this-link-they-may-need-to-invite-you-to-one-of-their-boards-or-organizations',
    ],
    cardNotFound: [
      'card-not-found',
      'this-card-may-be-on-a-private-board-you-may-be-able-to-view-it-by-logging-in',
      'this-card-may-be-on-a-private-board-if-someone-gave-you-this-link-they-may-need-to-invite-you-to-one-of-their-boards-or-organizations',
    ],
    malformedUrl: [
      'malformed-url',
      'the-url-does-not-look-like-a-valid-trello-url',
      'the-url-does-not-look-like-a-valid-trello-url',
    ],
    boardInvitationNotFound: ['board-invitation-not-valid'],
    orgInvitationNotFound: ['org-invitation-not-valid'],
    unconfirmedOrgNotFound: [
      'please-confirm-your-email-address-to-view-this-org',
    ],
    unconfirmedBoardNotFound: [
      'please-confirm-your-email-address-to-view-this-board',
    ],
    unconfirmedEnterpriseNotFound: [
      'please-confirm-your-email-address-to-view-this-enterprise',
    ],
  };

  const { adjustedErrorType } = useRequestAccessPage({
    isLoggedIn,
    errorType,
    reason,
  });

  switch (adjustedErrorType) {
    case 'requestAccessExperiment':
      return (
        <ErrorBoundary
          errorHandlerComponent={RequestAccessErrorHandler}
          tags={{ ownershipArea: 'trello-nusku' }}
        >
          <RequestAccessPage />;
        </ErrorBoundary>
      );

    case 'notFound':
    case 'boardNotFound':
    case 'notPermissionsToSeeBoard':
    case 'cardNotFound':
    case 'malformedUrl': {
      const [
        headerKey,
        loggedInMessageKey,
        notLoggedInMessageKey,
      ] = messageKeys[errorType];
      return (
        <NormalError
          headerKey={headerKey}
          loggedInMessageKey={loggedInMessageKey}
          notLoggedInMessageKey={notLoggedInMessageKey}
          isLoggedIn={isLoggedIn}
          fullName={fullName}
        />
      );
    }
    case 'boardInvitationNotFound':
    case 'orgInvitationNotFound':
      return <InvitationLinkError messageKey={messageKeys[errorType][0]} />;
    case 'unconfirmedOrgNotFound':
    case 'unconfirmedBoardNotFound':
    case 'unconfirmedEnterpriseNotFound':
      return (
        <UnconfirmedModelError
          messageKey={messageKeys[errorType][0]}
          email={email}
        />
      );
    default:
      return (
        <div className={cx(styles.bigMessage, styles.quiet)}>
          <h1>{format('page-not-found')}</h1>
        </div>
      );
  }
};
