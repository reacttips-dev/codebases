import React from 'react';

import { KnownService, KnownServiceComponentProps } from './known-service';

import styles from './styles.less';

interface OwnProps extends KnownServiceComponentProps {
  url: string;
  project: string;
  repo: string;
  branch: string;
  hash: string;
}

export const KilCaseComponent: React.FunctionComponent<OwnProps> = ({
  url,
  project,
  repo,
  branch,
  hash,
  ...anchorProps
}) => {
  const displayText =
    repo === 'Group'
      ? `${project} » ${branch}: ${hash}`
      : `${project} » ${repo} » ${branch}: ${hash}`;

  return (
    <a {...anchorProps} href={url} className={styles.knownServiceLink}>
      <img
        className={styles.knownServiceIcon}
        alt="Kiln Icon"
        src={require('resources/images/services/kiln.png')}
      />
      {displayText}
    </a>
  );
};

export const KilnCase: KnownService<OwnProps> = {
  match: {
    protocol: /^https?:$/,
    host: /^[^.]+\.(?:fogbugz\.com\/kiln|kilnhg\.com)$/,
    pathname: new RegExp(`\
^\
/Code/\
([^/]+)\
/\
([^/]+)\
/\
([^/]+)\
/History/\
([^/]+)\
`),
  },
  getMatchProps: ([url, _, project, repo, branch, hash]: string[]) => {
    return { url, project, repo, branch, hash };
  },
  Component: KilCaseComponent,
};
