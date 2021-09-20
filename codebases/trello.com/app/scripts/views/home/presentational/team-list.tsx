import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { State } from 'app/gamma/src/modules/types';
import { getMyTeams } from 'app/gamma/src/selectors/teams';
import {
  ExpandableNavigationItem,
  ExpandableNavigationItemLink,
  ExpandableNavigationItemLogo,
  ExpandableNavigationItemText,
  ExpandableNavigationItemList,
  ExpandableNavigationItemButtonProps,
} from 'app/src/components/ExpandableNavigation';
import { TeamModel, EnterpriseModel } from 'app/gamma/src/types/models';
import { TeamTabProps, TeamLinkSubTab } from './team-tab';
import { HomeTestIds } from '@trello/test-ids';
import { CreateTeamButton } from './create-team-button';
import { SectionHeader } from './section-header';
import { UpgradeSmartComponent } from 'app/src/components/UpgradePrompts';
import { logoDomain } from '@trello/config';
import styles from './team-list.less';
import { WorkspaceDefaultLogo } from 'app/src/components/WorkspaceLogo/WorkspaceDefaultLogo';

import { forTemplate } from '@trello/i18n';
import { DownIcon } from '@trello/nachos/icons/down';
import { UpIcon } from '@trello/nachos/icons/up';
const l = forTemplate('home');

interface TeamTabListProps {
  teamTabs: TeamTabProps[];
  createTeamButton: ExpandableNavigationItemButtonProps;
  enterprises: EnterpriseModel[];
}

interface TeamTabListStateProps {
  teams: TeamModel[];
}

interface TeamTabListDispatchProps {}

interface TeamTabSectionProps {
  teamTabs: TeamTabProps[];
  createTeamButton: ExpandableNavigationItemButtonProps;
  sectionTitle: string;
  showCreateTeamButton: boolean;
  noFixedHeight?: boolean;
  enterpriseId?: string;
}

type AllTeamTabListProps = TeamTabListProps &
  TeamTabListStateProps &
  TeamTabListDispatchProps;

const TeamTab: React.FunctionComponent<TeamTabProps> = ({
  billingUrl,
  displayName,
  expanded,
  orgId,
  linkTabs,
  logoUrl1x,
  logoUrl2x,
  selected,
  idEnterprise,
  hasViewsFeature,
  ...props
}) => {
  return (
    <ExpandableNavigationItem
      data-test-id={`${HomeTestIds.TeamTabSection}${orgId}`}
    >
      <ExpandableNavigationItemLink selected={selected} {...props}>
        {logoUrl1x && (
          <ExpandableNavigationItemLogo
            logoUrl1x={logoUrl1x}
            logoUrl2x={logoUrl2x}
          />
        )}
        {!logoUrl1x && (
          <WorkspaceDefaultLogo
            name={displayName}
            className={styles.defaultLogo}
          />
        )}
        <ExpandableNavigationItemText data-test-id={HomeTestIds.TeamTabName}>
          {displayName}
        </ExpandableNavigationItemText>
        {expanded ? (
          <UpIcon size="small" dangerous_className={styles.collapseChevron} />
        ) : (
          <DownIcon size="small" dangerous_className={styles.expandChevron} />
        )}
      </ExpandableNavigationItemLink>
      {expanded && !!linkTabs.length && (
        <ExpandableNavigationItemList>
          {linkTabs.map((linkTab) => (
            <TeamLinkSubTab {...linkTab} />
          ))}
        </ExpandableNavigationItemList>
      )}
      {/*
        here we check isShowing prompt so that the upgrade prompt can
        handle the effects of unmounting, and whatever side effects that
        has, such as redirecting after starting free trial.
      */}
      {expanded && (
        <UpgradeSmartComponent
          orgId={orgId}
          promptId="memberHomeScreenPromptFull"
        />
      )}
    </ExpandableNavigationItem>
  );
};

const TeamTabSection: React.FunctionComponent<TeamTabSectionProps> = ({
  sectionTitle,
  showCreateTeamButton,
  createTeamButton,
  teamTabs,
  noFixedHeight,
  enterpriseId,
}) => {
  return (
    <>
      <div className={styles.sectionHeaderWrapper}>
        <SectionHeader noMargin noFixedHeight={noFixedHeight}>
          {sectionTitle}
        </SectionHeader>
        {showCreateTeamButton && (
          <CreateTeamButton enterpriseId={enterpriseId} {...createTeamButton} />
        )}
      </div>
      {teamTabs.map((teamTab) => (
        <TeamTab {...teamTab} />
      ))}
    </>
  );
};

const mapStateToProps = (state: State): TeamTabListStateProps => ({
  teams: getMyTeams(state),
});

const TeamTabListUnconnected: React.FunctionComponent<AllTeamTabListProps> = ({
  teamTabs,
  teams,
  createTeamButton,
  enterprises,
}) => {
  const enterpriseIds = enterprises.map((e) => e.id);
  const groupedTeams = _.groupBy(teamTabs, (team) => {
    const idEnterprise = team.idEnterprise;
    // Not the most elegant solution, but `_.groupBy` would
    // return an object with `null` as a key otherwise
    // If a team has an idEnterprise but we cannot find
    // its enterprise, it might be BCPO or AtlOrg and
    // we should display it in 'OTHER TEAMS'
    return idEnterprise && enterpriseIds.includes(idEnterprise)
      ? idEnterprise
      : 'non-enterprise';
  });
  const enterpriseSections = enterprises
    .map((ent) => _.extend(ent, { teams: groupedTeams[ent.id] }))
    .filter((ent) => !!ent.teams);
  const hasTeams = teams.length > 0;

  return (
    <ExpandableNavigationItemList>
      {enterpriseSections.length ? (
        <>
          {enterpriseSections.map((ent) => (
            <React.Fragment key={ent.id}>
              <hr />
              {ent.logoHash && (
                <div className={styles.entLogo}>
                  <img
                    src={`${logoDomain}/${ent.logoHash}/170.png`}
                    alt=""
                    role="presentation"
                    data-test-id={`${HomeTestIds.TeamTabSection}${ent.id}`}
                  />
                </div>
              )}
              <TeamTabSection
                sectionTitle={`${ent.displayName} ${l('teams')}`}
                showCreateTeamButton={hasTeams}
                createTeamButton={createTeamButton}
                teamTabs={ent.teams}
                noFixedHeight={true}
                enterpriseId={ent.id}
              />
            </React.Fragment>
          ))}
          <hr />
          <TeamTabSection
            sectionTitle={l('other-teams')}
            showCreateTeamButton={hasTeams}
            createTeamButton={createTeamButton}
            teamTabs={groupedTeams['non-enterprise'] || []}
          />
        </>
      ) : (
        <TeamTabSection
          sectionTitle={l('teams')}
          showCreateTeamButton={hasTeams}
          createTeamButton={createTeamButton}
          teamTabs={teamTabs}
        />
      )}
      {!hasTeams && (
        <ExpandableNavigationItem>
          <CreateTeamButton fullTab {...createTeamButton} />
        </ExpandableNavigationItem>
      )}
    </ExpandableNavigationItemList>
  );
};

export const TeamTabList = connect(mapStateToProps)(TeamTabListUnconnected);
