import React from 'react';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { EnterpriseModel } from 'app/gamma/src/types/models';
import {
  ExpandableNavigationItem,
  ExpandableNavigationItemButtonProps,
  ExpandableNavigationItemIcon,
  ExpandableNavigationItemLink,
  ExpandableNavigationItemLinkProps,
  ExpandableNavigationItemList,
  ExpandableNavigation,
  ExpandableNavigationItemText,
} from 'app/src/components/ExpandableNavigation';
import { TeamTabProps } from './team-tab';
import { TeamTabList } from './team-list';
import { TemplatesTab, TemplatesTabProps } from './templates-tab';
import { HomeTab, HomeTabProps } from './home-tab';

import { forTemplate } from '@trello/i18n';
const l = forTemplate('home');

type BoardsTabProps = ExpandableNavigationItemLinkProps;

const BoardsTab: React.FunctionComponent<BoardsTabProps> = (props) => (
  <ExpandableNavigationItem>
    <ExpandableNavigationItemLink {...props}>
      <ExpandableNavigationItemIcon iconName="board" />
      <ExpandableNavigationItemText>{l('boards')}</ExpandableNavigationItemText>
    </ExpandableNavigationItemLink>
  </ExpandableNavigationItem>
);

interface NavigationProps {
  homeTab: HomeTabProps;
  boardsTab: BoardsTabProps;
  teamTabs: TeamTabProps[];
  templatesTab: TemplatesTabProps;
  createTeamButton: ExpandableNavigationItemButtonProps;
  enterprises: EnterpriseModel[];
}

export const Navigation: React.FunctionComponent<NavigationProps> = ({
  homeTab,
  boardsTab,
  teamTabs,
  templatesTab,
  createTeamButton,
  enterprises,
  ...props
}) => {
  return (
    <nav {...props}>
      <ExpandableNavigation>
        <ExpandableNavigationItemList>
          <BoardsTab {...boardsTab} />
          <ComponentWrapper>
            <TemplatesTab {...templatesTab} />
          </ComponentWrapper>
          <HomeTab {...homeTab} />
        </ExpandableNavigationItemList>
      </ExpandableNavigation>
      <ExpandableNavigation>
        <ComponentWrapper>
          <TeamTabList
            teamTabs={teamTabs}
            createTeamButton={createTeamButton}
            enterprises={enterprises}
          />
        </ComponentWrapper>
      </ExpandableNavigation>
    </nav>
  );
};
