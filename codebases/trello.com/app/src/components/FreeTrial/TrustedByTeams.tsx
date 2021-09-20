import styles from './TrustedByTeams.less';
import React from 'react';
import { forNamespace } from '@trello/i18n';
const format = forNamespace('upgrade-prompt-plan-selection-consolidated');

export const TrustedByTeams = () => (
  <div className={styles.trustedBy}>
    <span>{format('trusted-by-teams-at')}</span>
    <img
      src={require('resources/images/upgrade-prompts/pinterest.svg')}
      alt="Pinterest"
      width="22"
    />
    <img
      src={require('resources/images/upgrade-prompts/google.svg')}
      alt="Google"
      width="64"
    />
    <img
      src={require('resources/images/upgrade-prompts/fortnite.svg')}
      alt="Fortnite"
      width="58"
    />
    <img
      src={require('resources/images/upgrade-prompts/peloton.svg')}
      alt="Peloton"
      width="85"
    />
  </div>
);
