import React, { FunctionComponent } from 'react';
import { forNamespace } from '@trello/i18n';
import styles from './AtlassianAppSwitcherEmptyState.less';

const format = forNamespace(['atlassian app switcher'], {
  shouldEscapeStrings: false,
});

const ERROR_IMAGE = require('resources/images/empty-states/app-switcher.svg');

export const AtlassianAppSwitcherEmptyState: FunctionComponent = () => {
  return (
    <div className={styles.appSwitcherEmptyState}>
      <img src={ERROR_IMAGE} alt={format('illustration alt text')} />
      <h3>{format('your account is unverified')}</h3>
      <p>{format('please confirm your email address')}</p>
    </div>
  );
};
