import { useTeamOnboardingChecklistDismissCheckItemMutation } from './TeamOnboardingChecklistDismissCheckItemMutation.generated';
import { useTeamOnboardingChecklistQuery } from './TeamOnboardingChecklistQuery.generated';
import { usesEnglish } from '@trello/locale';
import { forNamespace } from '@trello/i18n';
import { Analytics, ActionSubjectIdType } from '@trello/atlassian-analytics';
import { useTeamOnboarding } from './useTeamOnboarding';
import { TrelloStorage } from '@trello/storage';
import { BCTeamOnboardingTestIds } from '@trello/test-ids';
import { getFreeTrialProperties } from '@trello/organizations';
// eslint-disable-next-line no-restricted-imports
import { Board } from '@trello/graphql/src/generated';

const format = forNamespace(['team onboarding', 'checklist']);

export enum TeamOnboardingChecklistKey {
  CreateTeam = 'create-team',
  AddABoard = 'add-a-board',
  AddAPowerUp = 'add-a-power-up',
  ExploreViews = 'explore-views',
  ManageTeamSettings = 'manage-team-settings',
  SetMemberPermissions = 'set-member-permissions',
  OnboardingComplete = 'onboarding-complete',
}

const checklistKeyToAnalyticsId: {
  [key in TeamOnboardingChecklistKey]?: string;
} = {
  [TeamOnboardingChecklistKey.CreateTeam]: '',
  [TeamOnboardingChecklistKey.AddABoard]: 'teamGettingStartedAddBoardLink',
  [TeamOnboardingChecklistKey.AddAPowerUp]: 'teamGettingStartedPowerupLink',
  [TeamOnboardingChecklistKey.ManageTeamSettings]:
    'teamGettingStartedSettingsLink',
  [TeamOnboardingChecklistKey.SetMemberPermissions]:
    'teamGettingStartedPermissionsLink',
};

export const TEAM_ONBOARDING_OTMD_KEY = (
  orgId: string,
  key: TeamOnboardingChecklistKey,
) => `team-onboarding-v1-${orgId}-${key}`;

interface TeamOnboardingChecklistItem {
  key: TeamOnboardingChecklistKey;
  title: string;
  subtitle?: string;
  href?: string;
  completed: boolean;
  testId: BCTeamOnboardingTestIds;
}

interface GenerateChecklistItemsArgs {
  orgId: string;
  orgName: string;
  oneTimeMessagesDismissed: string[];
  orgMemberCount: number;
  activeMembers: number;
  isFreeTrial: boolean;
  isEnglish: boolean;
  latestBoard: Pick<Board, 'id' | 'dateLastView' | 'closed' | 'url'>;
}

const generateChecklistItems = ({
  orgId,
  orgName,
  oneTimeMessagesDismissed,
  orgMemberCount,
  activeMembers,
  isFreeTrial,
  isEnglish,
  latestBoard,
}: GenerateChecklistItemsArgs): TeamOnboardingChecklistItem[] => {
  const isComplete = (key: TeamOnboardingChecklistKey) =>
    oneTimeMessagesDismissed.includes(TEAM_ONBOARDING_OTMD_KEY(orgId, key));

  let powerupPath: string | undefined;
  let calendarViewPath: string | undefined;
  if (latestBoard) {
    const latestBoardURL = new URL(latestBoard.url);
    latestBoardURL.searchParams.set('cameFromGettingStarted', 'true');
    calendarViewPath = latestBoardURL.pathname;
    powerupPath = latestBoardURL.pathname + latestBoardURL.search;
  }

  return [
    {
      key: TeamOnboardingChecklistKey.CreateTeam,
      title: format([
        'item-1',
        isFreeTrial ? 'title-free-trial' : 'title-paid-workspace',
      ]),
      completed: true,
      testId: BCTeamOnboardingTestIds.BCTeamOnboardingCheckItem1,
    },
    {
      key: TeamOnboardingChecklistKey.AddABoard,
      title: format(['item-2', 'item-2 title']),
      subtitle: format(['item-2', 'item-2 subtitle']),
      href: isEnglish ? `/${orgName}/home` : '/templates',
      completed: isComplete(TeamOnboardingChecklistKey.AddABoard),
      testId: BCTeamOnboardingTestIds.BCTeamOnboardingCheckItem2,
    },
    {
      key: TeamOnboardingChecklistKey.AddAPowerUp,
      title: format(['item-3', 'title']),
      subtitle: format(['item-3', 'subtitle']),
      href: powerupPath ?? '/power-ups',
      completed: isComplete(TeamOnboardingChecklistKey.AddAPowerUp),
      testId: BCTeamOnboardingTestIds.BCTeamOnboardingCheckItem3,
    },
    {
      key: TeamOnboardingChecklistKey.ExploreViews,
      title: format(['item-4', 'title']),
      subtitle: format(['item-4', 'subtitle']),
      href: calendarViewPath
        ? `${calendarViewPath}/calendar-view`
        : `/${orgName}/tables`,
      completed: isComplete(TeamOnboardingChecklistKey.ExploreViews),
      testId: BCTeamOnboardingTestIds.BCTeamOnboardingCheckItem4,
    },
    {
      key: TeamOnboardingChecklistKey.ManageTeamSettings,
      title: format(['item-5', 'item-5 title']),
      subtitle: format(['item-5', 'subtitle']),
      href: `/${orgName}/account`,
      completed: isComplete(TeamOnboardingChecklistKey.ManageTeamSettings),
      testId: BCTeamOnboardingTestIds.BCTeamOnboardingCheckItem5,
    },
    {
      key: TeamOnboardingChecklistKey.SetMemberPermissions,
      title:
        orgMemberCount && activeMembers > 1
          ? format(['item-6', 'title'])
          : format(['item-6', 'item-6 invite-members-title']),
      subtitle: format(['item-6', 'item-6 subtitle']),
      href: `/${orgName}/members`,
      completed: isComplete(TeamOnboardingChecklistKey.SetMemberPermissions),
      testId: BCTeamOnboardingTestIds.BCTeamOnboardingCheckItem6,
    },
  ];
};

interface UseTeamOnboardingChecklistReturn {
  checklistItems: TeamOnboardingChecklistItem[];
  completedCount: number;
  onClickChecklistItem: (key: TeamOnboardingChecklistKey) => void;
  dismissChecklistItem: (key: TeamOnboardingChecklistKey) => void;
  loading: boolean;
  oneTimeMessagesDismissed: string[];
}
export const useTeamOnboardingChecklist = (
  orgId: string,
): UseTeamOnboardingChecklistReturn => {
  const { data, loading } = useTeamOnboardingChecklistQuery({
    variables: { orgId },
  });
  const { isFreeTrialActive } = useTeamOnboarding(orgId);
  const [
    dismissChecklistItemMutation,
  ] = useTeamOnboardingChecklistDismissCheckItemMutation();

  // Return early on load to prevent un-necessary format renders
  if (loading) {
    return {
      checklistItems: [],
      completedCount: 0,
      onClickChecklistItem: () => {},
      dismissChecklistItem: () => {},
      loading,
      oneTimeMessagesDismissed: [],
    };
  }

  const orgName = data?.organization?.name ?? '';

  // Get the on time messages
  const oneTimeMessagesDismissed = (data?.member?.oneTimeMessagesDismissed ??
    []) as string[];

  // Team has a free trial credit
  const isFreeTrial = !!getFreeTrialProperties(
    data?.organization?.credits || [],
    data?.organization?.products || [],
    data?.organization?.paidAccount?.trialExpiration || '',
  )?.isActive;

  // Find memberships
  const teamMemberships = data?.organization?.memberships ?? [];

  // Filter deactivated members
  const activeMembers = teamMemberships?.filter((member) => !member.deactivated)
    .length;

  // User is English locale
  const isEnglish = usesEnglish();

  // Sort team boards and get latest url
  const boards = data?.organization?.boards ?? [];

  const latestBoard = boards
    .filter((board) => !board.closed)
    .sort(
      (a, b) =>
        new Date(b?.dateLastView!).getTime() -
        new Date(a?.dateLastView!).getTime(),
    )[0];

  // Generate the list of checklist items using the conditionals above
  const checklistItems = generateChecklistItems({
    orgId,
    orgName,
    oneTimeMessagesDismissed,
    orgMemberCount: data?.organization?.members?.length ?? 0,
    activeMembers,
    isFreeTrial,
    isEnglish,
    latestBoard,
  });
  const completedCount = checklistItems.filter(({ completed }) => completed)
    .length;

  const dismissChecklistItem = (key: TeamOnboardingChecklistKey) =>
    dismissChecklistItemMutation({
      variables: {
        messageId: TEAM_ONBOARDING_OTMD_KEY(orgId, key),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addOneTimeMessagesDismissed: {
          id: 'me',
          oneTimeMessagesDismissed: oneTimeMessagesDismissed!.concat([
            TEAM_ONBOARDING_OTMD_KEY(orgId, key),
          ]),
          __typename: 'Member',
        },
      },
    });
  const onClickChecklistItem = (key: TeamOnboardingChecklistKey) => {
    const linkName = checklistKeyToAnalyticsId[key];
    if (linkName) {
      Analytics.sendClickedLinkEvent({
        linkName: linkName as ActionSubjectIdType,
        source: 'teamGettingStartedHomeSectionItem',
        containers: {
          organization: {
            id: orgId,
          },
        },
        attributes: {
          paidStanding: isFreeTrialActive ? 'free-trial' : 'bc',
        },
      });
    }

    TrelloStorage.set(
      `home_${data?.member?.id}_last_tab_2`,
      `/${orgName}/getting-started`,
    );

    dismissChecklistItem(key);
  };

  return {
    checklistItems,
    completedCount,
    onClickChecklistItem,
    dismissChecklistItem,
    loading,
    oneTimeMessagesDismissed,
  };
};
