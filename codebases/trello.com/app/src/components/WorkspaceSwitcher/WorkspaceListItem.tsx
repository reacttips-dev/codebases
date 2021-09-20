import React from 'react';

import RouterLink from 'app/src/components/RouterLink/RouterLink';

import { WorkspaceLogo } from 'app/src/components/WorkspaceLogo/WorkspaceLogo';
import styles from './WorkspaceListItem.less';

export interface WorkspaceListItemProps {
  href?: string;
  onClick?: () => void;
  displayName: string;
  logoHash?: string | null;
}

export const WorkspaceListItem = ({
  href,
  onClick,
  displayName,
  logoHash,
}: WorkspaceListItemProps) => {
  if (href && onClick) {
    return (
      <RouterLink
        className={styles.workspaceListItem}
        href={href}
        onClick={onClick}
      >
        <WorkspaceLogo logoHash={logoHash} name={displayName} />
        <p className={styles.workspaceName}>{displayName}</p>
      </RouterLink>
    );
  }
  return (
    <div className={styles.workspaceListItemStatic}>
      <WorkspaceLogo logoHash={logoHash} name={displayName} />
      <p className={styles.workspaceName}>{displayName}</p>
    </div>
  );
};
