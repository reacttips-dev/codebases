import React from 'react';
import {
  ExpandableNavigationItem,
  ExpandableNavigationItemIcon,
  ExpandableNavigationItemIconProps,
  ExpandableNavigationItemLink,
  ExpandableNavigationItemLinkProps,
  ExpandableNavigationItemLogoProps,
  ExpandableNavigationItemText,
} from 'app/src/components/ExpandableNavigation';

import styles from './navigation.less';

export interface TeamTabProps
  extends ExpandableNavigationItemLogoProps,
    ExpandableNavigationItemLinkProps {
  billingUrl: string;
  displayName: string;
  expanded: boolean;
  orgId: string;
  linkTabs: TeamLinkSubTabProps[];
  selected: boolean;
  idEnterprise?: string;
  hasViewsFeature: boolean;
}

interface TeamLinkSubTabProps
  extends ExpandableNavigationItemLinkProps,
    ExpandableNavigationItemIconProps {
  displayName: string;
  external?: boolean;
  decoration?: React.ReactNode;
  selected: boolean;
}

export const TeamLinkSubTab: React.FunctionComponent<TeamLinkSubTabProps> = ({
  displayName,
  external,
  iconName,
  icon,
  selected,
  decoration,
  ...props
}) => (
  <ExpandableNavigationItem>
    <ExpandableNavigationItemLink
      selected={selected}
      className={external ? styles.externalLink : ''}
      indented
      small
      quiet
      {...props}
    >
      <ExpandableNavigationItemIcon iconName={iconName} icon={icon} />
      <ExpandableNavigationItemText className={styles.displayName}>
        {displayName}
      </ExpandableNavigationItemText>
      {decoration}
      {external && !selected && (
        <ExpandableNavigationItemIcon
          iconName={'forward'}
          className={styles.externalIcon}
        />
      )}
    </ExpandableNavigationItemLink>
  </ExpandableNavigationItem>
);
