import React from 'react';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';
import { isEmbeddedDocument } from '@trello/browser';
import PopUpWindow from 'app/scripts/views/lib/pop-up-window';
import { Util } from 'app/scripts/lib/util';
import { TrelloStorage } from '@trello/storage';
import { featureFlagClient } from '@trello/feature-flag-client';
import { identityBaseUrl, siteDomain } from '@trello/config';

// eslint-disable-next-line @trello/less-matches-component
import styles from './Error.less';

const format = forTemplate('error');

interface NormalErrorProps {
  headerKey: string;
  loggedInMessageKey: string;
  notLoggedInMessageKey: string;
  isLoggedIn: boolean;
  fullName: string;
}

export const NormalError: React.FunctionComponent<NormalErrorProps> = ({
  headerKey,
  loggedInMessageKey,
  notLoggedInMessageKey,
  isLoggedIn,
  fullName,
}) => {
  const returnUrl = window.location.pathname;
  const params = new URLSearchParams({
    prompt: 'select_account',
    continue: `${siteDomain}/auth/atlassian/callback?returnUrl=${returnUrl}`,
    application: 'trello',
  }).toString();

  const login = function (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    Util.stop(e);

    const returnUrl: string = isEmbeddedDocument()
      ? '/embed/login'
      : location.pathname + location.search;
    const loginUrl: string =
      '/login?' + new URLSearchParams({ returnUrl }).toString();

    if (isEmbeddedDocument()) {
      new PopUpWindow(loginUrl).open();
    } else {
      window.location.href = loginUrl;
    }
  };

  const logInLink = (
    // eslint-disable-next-line react/jsx-no-bind
    <a href="#" className="js-login" onClick={login}>
      {format('log-in-link-text')}
    </a>
  );

  return (
    <div className={cx(styles.bigMessage, styles.quiet)}>
      <h1>{format(headerKey)}</h1>
      {isLoggedIn ? (
        <React.Fragment>
          <p>{format(notLoggedInMessageKey, { logInLink })}</p>
          <div className={styles.littleMessage}>
            {
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: format('different-current-user', {
                    currentUserName: fullName,
                  }),
                }}
              />
            }
            {featureFlagClient.get('aa4a.account-switcher', false) &&
            TrelloStorage.get('accountSwitcherAccountAdded') ? (
              <a href={`${identityBaseUrl}/login?${params}`}>
                {format('switch-accounts')}
              </a>
            ) : (
              <a
                href={`/login?reauthenticate=1&returnUrl=${encodeURIComponent(
                  returnUrl,
                )}`}
              >
                {format('switch-accounts')}
              </a>
            )}
          </div>
        </React.Fragment>
      ) : (
        <p>{format(loggedInMessageKey, { logInLink })}</p>
      )}
    </div>
  );
};
