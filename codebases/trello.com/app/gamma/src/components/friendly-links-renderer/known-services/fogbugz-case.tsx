import React from 'react';

import { forNamespace } from '@trello/i18n';

import { KnownService, KnownServiceComponentProps } from './known-service';

import styles from './styles.less';

const format = forNamespace('known services');

interface OwnProps extends KnownServiceComponentProps {
  url: string;
  caseNumber: string;
}

export const FogBugzCaseComponent: React.FunctionComponent<OwnProps> = ({
  url,
  caseNumber,
  ...anchorProps
}) => {
  return (
    <a {...anchorProps} href={url} className={styles.knownServiceLink}>
      <img
        className={styles.knownServiceIcon}
        alt="Fogbugz Icon"
        src={require('resources/images/services/fogbugz.png')}
      />
      {format(['fogbugz case', 'text'], { caseNumber })}
    </a>
  );
};

export const FogBugzCase: KnownService<OwnProps> = {
  match: {
    protocol: /^https?:$/,
    host: /^[^.]+\.fogbugz\.com$/,
    pathname: new RegExp(`\
^\
/f/cases/\
([\\d]+)\
`),
  },
  getMatchProps: ([url, _, caseNumber]: string[]) => {
    return { caseNumber, url };
  },
  Component: FogBugzCaseComponent,
};
