import React from 'react';
import {
  ExpandableNavigationItem,
  ExpandableNavigationItemIcon,
  ExpandableNavigationItemLink,
  ExpandableNavigationItemLinkProps,
  ExpandableNavigationItemText,
} from 'app/src/components/ExpandableNavigation';
import { HomeTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
const format = forTemplate('home');

export type HomeTabProps = ExpandableNavigationItemLinkProps;

export const HomeTab: React.FunctionComponent<HomeTabProps> = ({
  ...props
}) => (
  <ExpandableNavigationItem>
    <ExpandableNavigationItemLink
      data-test-id={HomeTestIds.HomeLink}
      {...props}
    >
      <ExpandableNavigationItemIcon iconName="home" />
      <ExpandableNavigationItemText>
        {format('home')}
      </ExpandableNavigationItemText>
    </ExpandableNavigationItemLink>
  </ExpandableNavigationItem>
);
