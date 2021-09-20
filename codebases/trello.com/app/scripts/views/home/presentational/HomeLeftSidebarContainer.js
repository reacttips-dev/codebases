import { Analytics } from '@trello/atlassian-analytics';
import { canViewTeamTablePage } from 'app/src/components/ViewsGenerics';
import { forNamespace, forTemplate } from '@trello/i18n';

import $ from 'jquery';
import { Auth } from 'app/scripts/db/auth';
import { BoardCollectionIcon } from '@trello/nachos/icons/board-collection';
import { BoardIcon } from '@trello/nachos/icons/board';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import { CheckboxCheckedIcon } from '@trello/nachos/icons/checkbox-checked';
import { CollectionIcon } from '@trello/nachos/icons/collection';
import Cookies from 'js-cookie';
import { FreeTeamOnboardingNavBadge } from 'app/src/components/FreeTeamOnboarding/FreeTeamOnboardingNavBadge';
import { GearIcon } from '@trello/nachos/icons/gear';
import { HeartIcon } from '@trello/nachos/icons/heart';
import { HomeTestIds } from '@trello/test-ids';
import { Navigation } from './navigation';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import { PremiumFeature } from '@trello/product-features';
import React from 'react';
import { TableIcon } from '@trello/nachos/icons/table';
import { TeamOnboardingNavBadge } from 'app/src/components/BusinessClassTeamOnboarding/TeamOnboardingNavBadge';
import { TrelloStorage } from '@trello/storage';
import { Util } from 'app/scripts/lib/util';
import _ from 'underscore';
import classNames from 'classnames';
import { defaultRouter } from 'app/src/router';
import {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} from 'app/src/components/WorkspaceNavigation';
import { logoDomain } from '@trello/config';
import moment from 'moment';
import { routes } from '@trello/routes';
import { shouldShowFreeTeamGettingStarted } from 'app/src/components/FreeTeamOnboarding/Helpers';
import { seesVersionedVariation } from '@trello/feature-flag-client';

const format = forTemplate('home');
const formatTeamOnboarding = forNamespace('team onboarding');
const formatBoardMenu = forTemplate('board_menu_default');

const isCurrentRoute = (route) => {
  const routePath = defaultRouter.getRoute().routePath;
  const formattedPath = routePath
    .substr(1, routePath.length)
    .replace(/\?(.*)$/, '');
  return route.regExp.test(formattedPath);
};

const isCurrentTeam = (teamName) => {
  const routePath = defaultRouter.getRoute().routePath;

  return !!routePath.match(new RegExp(`^/${teamName}/`));
};

const canShowBCTeamOnboarding = (org, member) => {
  const dateFirstSubscription = org.get('paidAccount')?.dateFirstSubscription;
  const startDate = moment('2020-07-05');
  // there is a bug where dateFirstSubscription is null right after initiating the
  // paidAccount. Since thats the only time it happens, there is nothing concerning
  // about defaulting to true here, since that inherently means its a new account.
  const isNewSubscription = dateFirstSubscription
    ? moment(dateFirstSubscription).isAfter(startDate)
    : true;

  return (
    !Auth.me().isDismissed(`bc-onboarding-home:${org.id}`) &&
    (org.isBusinessClass() || org.isStandard()) &&
    org.ownedByMember(member) &&
    (isNewSubscription || Cookies.get('simulateNewOrg'))
  );
};

export class HomeLeftSidebarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateTeamClick = this.onCreateTeamClick.bind(this);
    this.setLastTab = this.setLastTab.bind(this);
    this.state = {
      expandedTeamTabs: this.getExpandedTeamTabs(),
      workspaceNavigationExpanded:
        workspaceNavigationState.value.enabled &&
        !workspaceNavigationHiddenState.value.hidden &&
        workspaceNavigationState.value.expanded,
    };
  }

  componentDidMount() {
    const updateWorkspaceNavigationExpanded = () => {
      this.setState({
        workspaceNavigationExpanded:
          workspaceNavigationState.value.enabled &&
          !workspaceNavigationHiddenState.value.hidden &&
          workspaceNavigationState.value.expanded,
      });
    };
    this.unsubscribeFromWorkspaceNavigationState = workspaceNavigationState.subscribe(
      updateWorkspaceNavigationExpanded,
    );
    this.unsubscribeFromWorkspaceNavigationHiddenState = workspaceNavigationHiddenState.subscribe(
      updateWorkspaceNavigationExpanded,
    );
  }

  componentWillUnmount() {
    this.unsubscribeFromWorkspaceNavigationState();
    this.unsubscribeFromWorkspaceNavigationHiddenState();
  }

  componentDidUpdate(prevProps, prevState) {
    const { expandedTeamTabs } = this.state;
    if (!_.isEqual(prevState.expandedTeamTabs, expandedTeamTabs)) {
      if (expandedTeamTabs) {
        this.setTeamTabExpandedLocalStorage(expandedTeamTabs);
      }
    }
  }

  onCreateTeamClick(e) {
    const CreateOrgView = require('app/scripts/views/organization/create-org-view');
    Util.preventDefault(e);

    const { model, modelCache } = this.props;
    const member = modelCache.get('Member', Auth.myId());
    const createOpts = {};

    if (member.isPaidManagedEntMember()) {
      createOpts.isEnterprise = true;
    }

    PopOver.toggle({
      elem: $(e.currentTarget),
      view: CreateOrgView,
      options: {
        model: model,
        modelCache: modelCache,
        createOpts,
        trackingOpts: {
          category: 'home',
        },
        method: 'by clicking create team in left sidebar',
      },
    });
  }

  setLastTab(url) {
    TrelloStorage.set(`home_${Auth.myId()}_last_tab_2`, url);
  }

  setTeamTabExpandedLocalStorage(expandedTeamTabs) {
    TrelloStorage.set('expanded_team_tabs', expandedTeamTabs);
  }

  getExpandedTeamTabs() {
    const { activeOrgname } = this.props;
    const expandedTeams = TrelloStorage.get('expanded_team_tabs') || [];

    if (activeOrgname) {
      expandedTeams.push(activeOrgname);
    } else if (expandedTeams.length === 0) {
      const orgs = this.props.modelCache
        .get('Member', Auth.myId())
        .getSortedOrgs();

      if (orgs.length === 1) {
        expandedTeams.push(orgs[0].attributes.name);
      }
    }

    return expandedTeams;
  }

  toggleTeamTabExpanded(name) {
    this.setState((state) => {
      if (state.expandedTeamTabs.includes(name)) {
        return {
          expandedTeamTabs: state.expandedTeamTabs.filter(
            (expandedTeamName) => expandedTeamName !== name,
          ),
        };
      } else {
        return {
          expandedTeamTabs: [...state.expandedTeamTabs, name],
        };
      }
    });
  }

  isTeamTabExpanded(name) {
    return this.state.expandedTeamTabs.includes(name);
  }

  render() {
    const { activeOrgname, modelCache, templateCategory } = this.props;
    const { workspaceNavigationExpanded } = this.state;

    const member = modelCache.get('Member', Auth.myId());
    const username = member.get('username');
    const orgs = member.getSortedOrgs();
    const enterprises = _.clone(member.enterpriseList.models)
      .filter((e) => e.id)
      .map((ent) => ({
        id: ent.get('id'),
        displayName: ent.get('displayName'),
        name: ent.get('name'),
        logoHash: ent.get('logoHash'),
      }))
      .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
    const urlHome = '/';
    const urlBoards = `/${username}/boards`;

    return (
      <Navigation
        className={classNames(
          'home-left-sidebar-container',
          workspaceNavigationExpanded &&
            'home-left-sidebar-container--workspace-nav-expanded',
        )}
        homeTab={{
          href: urlHome,
          selected: isCurrentRoute(routes.memberHome),
          onClick: () => {
            this.setLastTab(urlHome);
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'tab',
              actionSubjectId: 'homeTab',
              source: 'memberHomeWorkspaceSidebarSection',
            });
          },
        }}
        boardsTab={{
          href: urlBoards,
          selected: isCurrentRoute(routes.memberAllBoards),
          onClick: () => {
            this.setLastTab(urlBoards);
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'tab',
              actionSubjectId: 'boardsTab',
              source: 'memberHomeWorkspaceSidebarSection',
            });
          },
        }}
        teamTabs={orgs.map((org) => {
          const { Controller } = require('app/scripts/controller');
          const name = org.get('name');
          const displayName = org.get('displayName');
          const logoHash = org.get('logoHash');
          const homeUrl = `/${name}/home`;
          const idEnterprise = org.get('idEnterprise');
          let linkTabs = [];
          const orgReportsUrl = Controller.getOrganizationReportsUrl(name);
          const isFreeTeam = Boolean(!org.isPremium());

          if (activeOrgname || this.isTeamTabExpanded(name)) {
            const orgHighlightsUrl = `/${name}/highlights`;
            const gettingStartedUrl = Controller.getTeamOnboardingUrl(name);
            const orgBoardsUrl = Controller.getOrganizationUrl(name);
            const orgTablesUrl = Controller.getOrganizationTablesUrl(name);
            const orgMembersUrl = Controller.getOrganizationMembersUrl(name);
            const orgAccountUrl = Controller.getOrganizationAccountUrl(name);
            const myWorkUrl = Controller.getWorkspaceDefaultMyWorkViewUrl(name);
            const customViewUrl = Controller.getWorkspaceDefaultCustomViewUrl(
              name,
            );
            const defaultViewsFeatureFlagEnabled = seesVersionedVariation(
              'remarkable.default-views',
              'alpha',
            );
            const canSeeOrgDefaultViews =
              defaultViewsFeatureFlagEnabled &&
              org.isFeatureEnabled(PremiumFeature.Views);

            linkTabs = _.compact([
              canShowBCTeamOnboarding(org, member) && {
                displayName: formatTeamOnboarding('title'),
                icon: <BusinessClassIcon />,
                href: gettingStartedUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'gettingStartedBCButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                external: true,
                selected:
                  isCurrentRoute(routes.teamGettingStarted) &&
                  isCurrentTeam(name),
                decoration: <TeamOnboardingNavBadge orgId={org.id} />,
                testId: HomeTestIds.TeamGettingStartedTab,
              },
              shouldShowFreeTeamGettingStarted(org, member) && {
                displayName: formatTeamOnboarding('title'),
                icon: <CheckboxCheckedIcon />,
                href: gettingStartedUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'gettingStartedFreeWorkspaceButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                external: true,
                selected:
                  isCurrentRoute(routes.teamGettingStarted) &&
                  isCurrentTeam(name),
                decoration: <FreeTeamOnboardingNavBadge orgId={org.id} />,
                testId: HomeTestIds.FreeTeamGettingStartedTab,
              },
              {
                displayName: format('boards'),
                icon: <BoardIcon />,
                href: homeUrl,
                selected:
                  name === activeOrgname &&
                  isCurrentRoute(routes.memberHomeBoards),
                onClick: () => {
                  this.setLastTab(homeUrl);
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'openBoardsButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                testId: HomeTestIds.TeamBoardsTab,
              },
              org.hasPremiumFeature('tags') && {
                displayName: formatBoardMenu('collections'),
                icon: <BoardCollectionIcon />,
                href: orgBoardsUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'homeCollectionsButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                external: true,
                testId: HomeTestIds.TeamCollectionsTab,
              },
              {
                displayName: format('highlights'),
                icon: <HeartIcon />,
                href: orgHighlightsUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'workspaceHighlightsButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                selected:
                  name === activeOrgname &&
                  isCurrentRoute(routes.teamHighlights),
                testId: HomeTestIds.TeamHighlightsTab,
              },
              canSeeOrgDefaultViews && {
                displayName: format('my-work'),
                icon: <TableIcon />,
                href: myWorkUrl,
                onClick: () => {
                  Analytics.sendClickedLinkEvent({
                    linkName: 'organizationMyWorkViewLink',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                external: true,
                testId: HomeTestIds.MyWorkTab,
              },
              canViewTeamTablePage(
                org.isFeatureEnabled(PremiumFeature.Views),
                org.isBusinessClass() || org.isEnterprise(),
              ) &&
                (defaultViewsFeatureFlagEnabled
                  ? {
                      displayName: format('custom-view'),
                      icon: <TableIcon />,
                      href: customViewUrl,
                      onClick: () => {
                        Analytics.sendClickedLinkEvent({
                          linkName: 'organizationCustomViewLink',
                          source: 'memberHomeWorkspaceSidebarSection',
                          containers: {
                            organization: {
                              id: org.id,
                            },
                          },
                        });
                      },
                      external: true,
                      testId: HomeTestIds.CustomViewTab,
                    }
                  : {
                      displayName: format('home-view-team-table'),
                      icon: <TableIcon />,
                      href: orgTablesUrl,
                      onClick: () => {
                        Analytics.sendClickedButtonEvent({
                          buttonName: 'workspaceTableButton',
                          source: 'memberHomeWorkspaceSidebarSection',
                          containers: {
                            organization: {
                              id: org.id,
                            },
                          },
                          attributes: {
                            isFreeTeam,
                          },
                        });
                      },
                      external: true,
                      testId: HomeTestIds.TeamTablesTab,
                    }),
              {
                displayName: format('home-view-members'),
                icon: <OrganizationIcon />,
                href: orgMembersUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'openMembersButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                external: true,
                testId: HomeTestIds.TeamMembersTab,
              },
              {
                displayName: format('home-view-settings'),
                icon: <GearIcon />,
                href: orgAccountUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'openSettingsButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                external: true,
                testId: HomeTestIds.TeamSettingsTab,
              },
            ]);
            if (org.belongsToRealEnterprise()) {
              linkTabs.splice(1, 0, {
                displayName: format('home-view-team-report'),
                // TODO: When we've added the proper icon use it here
                icon: <CollectionIcon />,
                href: orgReportsUrl,
                onClick: () => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: 'openWorkspaceReportButton',
                    source: 'memberHomeWorkspaceSidebarSection',
                    containers: {
                      organization: {
                        id: org.id,
                      },
                    },
                  });
                },
                selected:
                  name === activeOrgname && isCurrentRoute(routes.teamReports),
                testId: HomeTestIds.TeamReportsTab,
              });
            }

            // Since we manually mutate the linkTabs list to add items conditionally,
            // map over them to add the index as a key on each item
            linkTabs = linkTabs.map((linkTab, idx) => ({
              ...linkTab,
              key: idx,
            }));
          }

          const expanded = this.isTeamTabExpanded(name);

          return {
            key: org.id,
            href: homeUrl,
            selected:
              name === activeOrgname && !this.isTeamTabExpanded(activeOrgname),
            expanded,
            displayName,
            orgId: org.id,
            billingUrl: Controller.getOrganizationBillingUrl(org.get('name')),
            hasViewsFeature: canViewTeamTablePage(
              org.isFeatureEnabled(PremiumFeature.Views),
              org.isBusinessClass() || org.isEnterprise(),
            ),
            logoUrl1x: logoHash && `${logoDomain}/${logoHash}/30.png`,
            logoUrl2x: logoHash && `${logoDomain}/${logoHash}/170.png`,
            linkTabs,
            idEnterprise,
            onClick: (e) => {
              e.preventDefault();

              Analytics.sendClickedButtonEvent({
                buttonName: expanded
                  ? 'workspaceTabCollapseButton'
                  : 'workspaceTabExpandButton',
                source: 'memberHomeWorkspaceSidebarSection',
                containers: {
                  organization: {
                    id: org.id,
                  },
                },
              });

              this.toggleTeamTabExpanded(name);

              return;
            },
          };
        })}
        templatesTab={{
          href: '/templates',
          onClick: () => {
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'tab',
              actionSubjectId: 'templateGalleryTab',
              source: 'memberHomeWorkspaceSidebarSection',
            });
          },
          templateCategory,
          expanded: isCurrentRoute(routes.templates),
          isSubmitPage: isCurrentRoute(routes.templatesSubmit),
          selected: isCurrentRoute({ regExp: new RegExp(/templates\/?$/) }),
        }}
        enterprises={enterprises}
        createTeamButton={{
          onClick: this.onCreateTeamClick,
        }}
      />
    );
  }
}
