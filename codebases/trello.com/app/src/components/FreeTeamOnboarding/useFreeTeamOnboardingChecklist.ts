import { useFreeTeamOnboardingChecklistDismissCheckItemMutation } from './FreeTeamOnboardingChecklistDismissCheckItemMutation.generated';
import { useFreeTeamOnboardingChecklistQuery } from './FreeTeamOnboardingChecklistQuery.generated';
import { forTemplate } from '@trello/i18n';
import { TrelloStorage } from '@trello/storage';
import { usesLanguages } from '@trello/locale';
import { FreeTeamOnboardingTestIds } from '@trello/test-ids';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('free_team_onboarding');

export enum FreeTeamOnboardingChecklistKey {
  CreateTeam = 'create-team',
  AddABoard = 'add-a-board',
  InviteTeammates = 'invite-teammates',
  ConnectYourApps = 'connect-your-apps',
  ExploreAutomations = 'explore-automations',
  OnboardingComplete = 'onboarding-complete',
}

export const getFreeTeamOnboardingDismissedMessageKey = (
  key: FreeTeamOnboardingChecklistKey,
) => `free-team-onboarding-${key}`;

interface FreeTeamOnboardingChecklistItem {
  key: FreeTeamOnboardingChecklistKey;
  title: string;
  subtitle?: string;
  href?: string;
  openInNewTab?: boolean;
  hasOnClick?: boolean;
  completed: boolean;
  testId: FreeTeamOnboardingTestIds;
}

interface GenerateChecklistItemsArgs {
  oneTimeMessagesDismissed: string[];
  latestBoardURL?: URL;
  isTeamCreator: boolean;
  orgName: string;
}

export const generateChecklistItems = ({
  oneTimeMessagesDismissed,
  isTeamCreator,
  latestBoardURL,
  orgName,
}: GenerateChecklistItemsArgs): FreeTeamOnboardingChecklistItem[] => {
  const isComplete = (key: FreeTeamOnboardingChecklistKey) =>
    oneTimeMessagesDismissed.includes(
      getFreeTeamOnboardingDismissedMessageKey(key),
    );

  const items: [FreeTeamOnboardingChecklistItem] = [
    {
      key: FreeTeamOnboardingChecklistKey.CreateTeam,
      title: isTeamCreator ? format('create-a-team') : format('join-a-team'),
      subtitle: format('teams-organize'),
      completed: true,
      testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem1,
    },
  ];

  if (usesLanguages(['en-US', 'pt-BR', 'fr'])) {
    items.push({
      key: FreeTeamOnboardingChecklistKey.AddABoard,
      title: format('add-a-board'),
      subtitle: format('create-your-workflow'),
      href: `/${orgName}/home`,
      completed: isComplete(FreeTeamOnboardingChecklistKey.AddABoard),
      testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem2,
    });
  } else {
    items.push({
      key: FreeTeamOnboardingChecklistKey.AddABoard,
      title: format('add-a-board'),
      subtitle: format('create-your-workflow'),
      hasOnClick: true,
      completed: isComplete(FreeTeamOnboardingChecklistKey.AddABoard),
      testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem2,
    });
  }

  items.push({
    key: FreeTeamOnboardingChecklistKey.InviteTeammates,
    title: format('invite-your-teammates'),
    subtitle: format('invite-the-people'),
    href: `/${orgName}/members`,
    completed: isComplete(FreeTeamOnboardingChecklistKey.InviteTeammates),
    testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem3,
  });

  if (latestBoardURL) {
    latestBoardURL.searchParams.set('showPopover', 'pups');
    items.push({
      key: FreeTeamOnboardingChecklistKey.ConnectYourApps,
      title: format('connect-your-apps'),
      subtitle: format('power-ups-connect'),
      href: latestBoardURL.pathname + latestBoardURL.search,
      completed: isComplete(FreeTeamOnboardingChecklistKey.ConnectYourApps),
      testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem4,
    });

    latestBoardURL.searchParams.set('showPopover', 'butler');
    items.push({
      key: FreeTeamOnboardingChecklistKey.ExploreAutomations,
      title: format('explore-automations'),
      subtitle: format('butler-can-automatically'),
      href: latestBoardURL.pathname + latestBoardURL.search,
      completed: isComplete(FreeTeamOnboardingChecklistKey.ExploreAutomations),
      testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem5,
    });
  } else {
    items.push(
      {
        key: FreeTeamOnboardingChecklistKey.ConnectYourApps,
        title: format('connect-your-apps'),
        subtitle: format('power-ups-connect'),
        href: '/power-ups',
        completed: isComplete(FreeTeamOnboardingChecklistKey.ConnectYourApps),
        testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem4,
      },
      {
        key: FreeTeamOnboardingChecklistKey.ExploreAutomations,
        title: format('explore-automations'),
        subtitle: format('butler-can-automatically'),
        openInNewTab: true,
        href: '/butler-automation',
        completed: isComplete(
          FreeTeamOnboardingChecklistKey.ExploreAutomations,
        ),
        testId: FreeTeamOnboardingTestIds.FreeTeamOnboardingCheckItem5,
      },
    );
  }

  return items;
};

interface UseFreeTeamOnboardingChecklistReturn {
  checklistItems: FreeTeamOnboardingChecklistItem[];
  completedCount: number;
  onClickChecklistItem: (key: FreeTeamOnboardingChecklistKey) => void;
  dismissChecklistItem: (key: FreeTeamOnboardingChecklistKey) => void;
  loading: boolean;
  oneTimeMessagesDismissed: string[];
}

export const useFreeTeamOnboardingChecklist = (
  orgId: string,
): UseFreeTeamOnboardingChecklistReturn => {
  const { data, loading } = useFreeTeamOnboardingChecklistQuery({
    variables: { orgId },
  });

  const [
    dismissChecklistItemMutation,
  ] = useFreeTeamOnboardingChecklistDismissCheckItemMutation();

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

  const isTeamCreator =
    data?.member?.id === data?.organization?.idMemberCreator;

  // Sort team boards and get latest url
  const boards = data?.organization?.boards ?? [];
  const sortedBoards = boards
    ?.filter((board) => !board.closed)
    .sort((a, b) => {
      if (!a?.dateLastActivity || !b?.dateLastActivity) {
        return 0;
      } else if (b.dateLastActivity > a.dateLastActivity) {
        return 1;
      } else {
        return -1;
      }
    });
  const latestBoard = sortedBoards[0];

  let latestBoardURL: URL | undefined;
  if (latestBoard) {
    latestBoardURL = new URL(latestBoard.url);
  }

  // Generate the list of checklist items using the conditionals above
  const checklistItems = generateChecklistItems({
    oneTimeMessagesDismissed,
    isTeamCreator,
    latestBoardURL,
    orgName,
  });
  const completedCount = checklistItems.filter(({ completed }) => completed)
    .length;

  const dismissChecklistItem = (key: FreeTeamOnboardingChecklistKey) =>
    dismissChecklistItemMutation({
      variables: {
        messageId: getFreeTeamOnboardingDismissedMessageKey(key),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addOneTimeMessagesDismissed: {
          id: 'me',
          oneTimeMessagesDismissed: oneTimeMessagesDismissed!.concat([
            getFreeTeamOnboardingDismissedMessageKey(key),
          ]),
          __typename: 'Member',
        },
      },
    });

  const onClickChecklistItem = (key: FreeTeamOnboardingChecklistKey) => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'option',
      actionSubjectId: 'freeTeamGettingStartedCheckItem',
      source: 'freeTeamGettingStartedScreen',
      attributes: { checkItemName: key },
      containers: {
        organization: {
          id: orgId,
        },
      },
    });

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
