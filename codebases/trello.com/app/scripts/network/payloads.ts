/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import f from 'effing';
import { valueUnion } from 'app/scripts/lib/util/value-union';
import _ from 'underscore';
import Queries from 'app/scripts/network/quick-queries';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';

interface Model {
  id: string;
  set: (property: string, value: string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (property: string) => any;
}

interface ModelCache {
  get: (modelType: 'List', id: string) => Model;
}

const orgBoardsMapping = function (
  deltaBoards: [{ id: string }],
  model: Model,
) {
  const idBoards = _.pluck(deltaBoards, 'id');
  return model.set('idBoards', idBoards);
};

const attachmentsUnion = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deltaAttachments: any,
  model: Model,
) {
  let left;
  const currentAttachments =
    (left = model.get('attachments')) != null ? left : [];
  const newAttachments = valueUnion(
    f.get('id'),
    currentAttachments,
    deltaAttachments,
  );
  return model.set('attachments', newAttachments);
};

interface List {
  id: string;
  _visible?: boolean;
}

interface Card {
  id: string;
  idList: string;
  _visible?: boolean;
}

// Assumes that board.cards and board.lists are both included, that closed
// cards/lists are not included, that the cards have the idList and pos
// fields defined and that lists have the pos field defined
const knownBoards: { [key: string]: boolean } = {};
const deprioritizeHiddenCards = function (
  board: { id: string; lists: List[]; cards: Card[] },
  modelCache: ModelCache,
) {
  knownBoards[board.id] = true;

  const { cards, lists } = board;

  // Hard coded list width
  const maxVisibleLists = Math.max(3, Math.ceil(window.innerWidth / 270));

  _.sortBy(lists, 'pos').forEach(
    (list, index) =>
      (list._visible =
        index < maxVisibleLists ||
        // We don't want to delay loading cards for lists we already know about
        modelCache.get('List', list.id) != null),
  );

  let boardHasOrphanedCards = false;

  const listsById = _.indexBy(lists, 'id');
  _.chain(cards)
    .groupBy('idList')
    .values()
    .map((listCards) => {
      return _.sortBy(listCards, 'pos').forEach(function (card, index) {
        const list = listsById[card.idList];
        if (list != null) {
          card._visible = list._visible;
        } else {
          boardHasOrphanedCards = true;
          card._visible = false;
        }
      });
    });

  if (boardHasOrphanedCards) {
    Analytics.sendOperationalEvent({
      actionSubject: 'orphanedCards',
      action: 'errored',
      source: getScreenFromUrl(),
      containers: {
        board: {
          id: board.id,
        },
      },
    });
  }

  const listsByVisible = _.groupBy(board.lists, '_visible');
  board.lists.forEach((list) => delete list._visible);

  const cardsByVisible = _.groupBy(board.cards, '_visible');
  board.cards.forEach((card) => delete card._visible);

  // NOTE: It makes a difference having the cards come before the lists
  // on the response and deferred response, we want the cards to be first
  // so they're already known when the list is initialized (and so they
  // aren't procesed as "adds" to the list's cardList)
  const deferredBoard: { id: string; cards: Card[]; lists: List[] } = {
    id: board.id,
    // @ts-expect-error
    cards: cardsByVisible[false] != null ? cardsByVisible[false] : [],
    // @ts-expect-error
    lists: listsByVisible[false] != null ? listsByVisible[false] : [],
  };

  // @ts-expect-error
  board.cards = cardsByVisible[true] != null ? cardsByVisible[true] : [];
  // @ts-expect-error
  board.lists = listsByVisible[true] != null ? listsByVisible[true] : [];

  if (deferredBoard.lists.length > 0 || deferredBoard.cards.length > 0) {
    return { data: board, deferred: deferredBoard };
  } else {
    return { data: board };
  }
};

const afterInitialLoad = function (board: Model) {
  if (knownBoards.hasOwnProperty(board.id)) {
    return { data: board };
  } else {
    return { deferred: board };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const membershipUnion = function (deltaMemberships: any, model: Model) {
  let left;
  const currentMemberships =
    (left = model.get('memberships')) != null ? left : [];
  const newMemberships = valueUnion(
    f.get('id'),
    currentMemberships,
    deltaMemberships,
  );
  return model.set('memberships', newMemberships);
};

const MINIMAL_MEMBERSHIPS = ['name', 'closed', 'memberships'].join(',');

const DefaultBoardFields = [
  'name',
  'desc',
  'descData',
  'closed',
  'idOrganization',
  'pinned',
  'url',
  'shortUrl',
  'prefs',
  'labelNames',
];

const Payloads: {
  action: { query: object };
  archivedLists: { query: object };
  archivedListsAndCards: { query: object };
  boardAttachment: { query: object };
  boardChecklists: { query: object };
  boardCompleter: { query: object };
  boardFieldsMinimal: string;
  boardFieldsMinimalMemberships: string;
  boardFieldsFull: string;
  boardFieldsMinimalSubscribed: string;
  boardFieldsUnread: string[];
  boardMinimal: { query: object; mappingRules: object };
  boardUnread: { query: object };
  boardsMenuMinimal: { query: object; mappingRules: object };
  cardAttachment: { query: object };
  cardCompleter: { query: object };
  cardCopy: { query: object };
  cardDetails: { query: object };
  cardMinimal: { query: object };
  cardVoters: { query: object };
  cardsAndListsMinimal: { query: object };
  customFields: { query: object };
  idCard: { query: object };
  listMinimal: { query: object };
  listsMinimal: { query: object };
  memberAccount: { query: object };
  memberActions: string;
  memberBilling: { query: object };
  memberCards: { query: object; mappingRules: object };
  memberMinimal: { query: object };
  memberOrganizationDeactivatedMembers: { query: object; mappingRules: object };
  memberProfile: { query: object };
  memberProfile_daysBack: number;
  orgMemberCards: { query: object };
  organization: { query: object; mappingRules: object };
  organizationExports: { query: object };
  organizationFieldsMaximumAndAvailableLicenseCount: { query: object };
  organizationFieldsMembersPage: string;
  organizationFieldsMembersPageWithAvailableLicenseCount: string;
  organizationFieldsMinimalMembershipsWithAvailableLicenseCount: [
    string[],
    string,
  ];
  organizationFieldsMinimalWithAvailableLicenseCount: { query: object };
  organizationMembers: { query: object };
  organizationMembersBoards: { query: object; mappingRules: object };
  organizationMembersCollaborators: { query: object };
  organizationMembersMinimal: { query: object };
  organizationMembersWithAvailableLicenseCount: { query: object };
  organizationMinimal: { query: object };
  organizations: { query: object };
  organizationsWithoutBoards: { query: object };
  organizationsMinimal: { query: object };
  listCards: { query: object };
  enterprise: { query: object };
  enterpriseMemberFields: string;
  enterpriseMinimum: { query: object };
  enterpriseOrganizationFields: string;
  memberFields: string;
  memberFieldsAndPremOrgsAdmin: string;
  organizationFieldsMinimal: string;
  organizationFieldsMinimalMemberships: string[];
  paidAccountFieldsMinimal: string;
  cardFieldsBulk: string;
  boardFieldsInOrganization: string;
  organizationBoardsFields: string;
  cardActions: string;
  boardActions: string;
  card: { query: object };
  organizationsMemberships: { query: object };
  organizationCredits: { query: object };
  currentBoardMinimal: {
    query: object;
    mappingRules: object;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    splitDeferred: any;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentBoardSecondary: { query: object; splitDeferred: any };
  currentBoardPluginData: {
    query: object;
    mappingRules: object;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    splitDeferred: any;
  };
  memberBoards: { query: object };
  memberHeader: { query: object };
  organizationBoardsPage: { query: object; mappingRules: object };
  memberQuickBoards: { query: object };
  quickBoardsSearch: { query: (search: string) => object };
  boardMinimalForDisplayCard: { query: object };
  currentCalendarMinimal: { query: object };
  organizationMembersBoardFields: string;
  pendingOrganizations: { mappingRules: object };
  workspaceBoardsPage: { query: object; mappingRules: object };
  workspaceBoardsPageMinimal: { query: object; mappingRules: object };
} = {
  boardFieldsMinimal: Queries.boardFieldsMinimal,
  boardFieldsFull: Queries.boardFieldsFull,
  boardFieldsMinimalSubscribed: Queries.boardFieldsMinimalSubscribed,
  memberFields: Queries.memberFields,
  memberFieldsAndPremOrgsAdmin: Queries.memberFieldsAndPremOrgsAdmin,
  organizationFieldsMinimal: Queries.organizationFieldsMinimal,
  paidAccountFieldsMinimal: Queries.paidAccountFieldsMinimal,
  cardFieldsBulk: Queries.cardFieldsBulk,
  boardFieldsInOrganization: Queries.boardFieldsInOrganization,
  organizationBoardsFields: Queries.organizationBoardsFields,
  cardActions: Queries.cardActions,
  boardActions: Queries.boardActions,
  card: { query: Queries.card },
  currentBoardMinimal: {
    query: Queries.currentBoardMinimal,
    mappingRules: { attachments: attachmentsUnion },
    splitDeferred: deprioritizeHiddenCards,
  },
  currentBoardSecondary: {
    query: Queries.currentBoardSecondary,
    splitDeferred: afterInitialLoad,
  },
  currentBoardPluginData: {
    query: Queries.currentBoardPluginData,
    mappingRules: {
      attachments: attachmentsUnion,
    },
    splitDeferred: afterInitialLoad,
  },
  memberBoards: { query: Queries.memberBoards },
  memberHeader: { query: Queries.memberHeader },
  organizationBoardsPage: {
    query: Queries.organizationBoardsPage,
    mappingRules: { boards: orgBoardsMapping },
  },
  memberQuickBoards: { query: Queries.memberQuickBoards },
  quickBoardsSearch: { query: Queries.quickBoardsSearch },
  boardMinimalForDisplayCard: {
    query: Queries.boardMinimalForDisplayCard,
  },
  // Have a version of board loading without any splitDeferred (always load
  // all cards immediately)
  currentCalendarMinimal: { query: Queries.currentBoardMinimal },
  memberActions: [Queries.boardActions, 'updateMember'].join(','),
  boardFieldsUnread: ['dateLastActivity', 'dateLastView'],
  boardAttachment: {
    query: {
      structure: 'all',
      structure_limit: 5,
      fields: 'name,prefs,shortLink,url',
    },
  },
  boardFieldsMinimalMemberships: MINIMAL_MEMBERSHIPS,
  organizationMembersBoardFields: [
    MINIMAL_MEMBERSHIPS,
    'idOrganization',
    'prefs',
  ].join(','),
  enterpriseMemberFields: [
    'active',
    'activityBlocked',
    'avatarUrl',
    'confirmed',
    'enterpriseActiveOrgCount',
    'enterpriseDeactivatedOrgCount',
    'fullName',
    'initials',
    'memberType',
    'nonPublic',
    'roles',
    'userType',
    'username',
    'memberEmail',
    'dateLastAccessed',
  ].join(','),
  enterpriseMinimum: {
    query: {
      fields: 'name,displayName',
    },
  },
  enterprise: {
    query: {
      fields:
        'displayName,name,prefs,products,organizationPrefs,pluginWhitelistingEnabled,idPluginsAllowed,idp,logoHash,domains,isAtlassianOrg,atlOrgId',
    },
  },
  enterpriseOrganizationFields: [
    'name',
    'displayName',
    'logoHash',
    'memberships',
  ].join(','),
  organizationFieldsMinimalMemberships: [
    Queries.organizationFieldsMinimal,
    'memberships',
  ],
  organizationFieldsMinimalMembershipsWithAvailableLicenseCount: [
    [Queries.organizationFieldsMinimal, 'memberships'],
    'availableLicenseCount',
  ],
  organizationFieldsMembersPage: [
    Queries.organizationBoardsFields,
    'memberships',
  ].join(','),
  organizationFieldsMembersPageWithAvailableLicenseCount: [
    Queries.organizationBoardsFields,
    'availableLicenseCount',
  ].join(','),
  boardMinimal: {
    query: {
      fields: Queries.boardFieldsMinimal,
      organization: true,
      organization_fields: Queries.organizationFieldsMinimal,
      myPermLevel: true,
      memberships: 'me',
    },
    mappingRules: {
      memberships: membershipUnion,
    },
  },
  boardChecklists: {
    query: {
      fields: '',
      cards: 'visible',
      card_fields: '',
      card_checklists: 'all',
    },
  },
  boardCompleter: {
    query: {
      fields: 'closed,idOrganization,name,url',
    },
  },
  boardsMenuMinimal: {
    query: {
      boards: 'open,starred',
      board_fields: Queries.boardFieldsMinimal,
      boardStars: true,
      organizations: 'all',
      organization_fields: Queries.organizationFieldsMinimal,
      board_organization: true,
      board_organization_fields: Queries.organizationFieldsMinimal,
      board_myPermLevel: true,
      board_memberships: 'me',
    },
    mappingRules: {
      memberships: membershipUnion,
    },
  },
  boardUnread: {
    query: {
      fields: ['dateLastActivity', 'dateLastView'],
    },
  },
  cardDetails: {
    query: {
      actions: Queries.cardActions,
      actions_display: true,
      action_memberCreator_fields: Queries.memberFieldsAndPremOrgsAdmin,
      action_reactions: true,
      members: true,
      member_fields: Queries.memberFields,
      attachments: true,
      fields: 'email',
      checklists: 'all',
      checklist_fields: 'all',
      list: true,
      pluginData: true,
      customFieldItems: true,
    },
  },
  cardAttachment: {
    query: {
      board: true,
      members: true,
      member_fields: Queries.memberFields,
      attachments: true,
      fields: 'all',
      checklists: 'all',
      list: true,
      pluginData: true,
      customFields: true,
      customFieldItems: true,
    },
  },
  cardMinimal: {
    query: {
      fields: Queries.cardFieldsBulk,
    },
  },
  cardCompleter: {
    query: {
      fields: 'closed,idBoard,name,url',
      board: true,
      board_fields: 'name',
    },
  },
  cardVoters: {
    query: {
      fields: 'idMembersVoted',
      membersVoted: true,
    },
  },
  cardCopy: {
    query: {
      members: true,
      member_fields: Queries.memberFields,
      attachments: true,
      stickers: true,
      fields: 'name',
      checklists: 'all',
    },
  },
  customFields: {
    query: {
      fields: '',
      customFields: true,
      cards: 'visible',
      card_customFieldItems: true,
      card_fields: '',
    },
  },
  memberAccount: {
    query: {
      tokens: 'all',
      sessions: 'all',
      credentials: 'all',
      logins: true,
      enterprises: true,
      enterprise_fields: 'prefs',
      token_plugins: true,
    },
  },
  memberBilling: {
    query: {
      paidAccount: true,
      paidAccount_fields: Queries.paidAccountFieldsMinimal,
      credits: 'invitation,promoCode',
      organizations: 'all',
      organization_fields: 'displayName,name,prefs,products,url',
      organization_paidAccount: true,
      organization_paidAccount_fields: Queries.paidAccountFieldsMinimal,
    },
  },
  orgMemberCards: {
    query: {
      board: true,
      list: true,
      fields:
        'badges,closed,dateLastActivity,due,dueComplete,idAttachmentCover,idList,idBoard,idMembers,idShort,labels,name,url',
      attachments: 'true',
      members: 'true',
      stickers: 'all',
      member_fields: Queries.memberFields,
      board_fields: MINIMAL_MEMBERSHIPS,
    },
  },
  memberCards: {
    query: {
      boards: 'open',
      board_fields: 'name,closed,idOrganization,prefs',
      board_lists: 'open',
      board_memberships: 'me',
      organizations: 'all',
      organization_fields: 'displayName,name,prefs,products,url',
      organization_memberships: 'me',
    },
    mappingRules: {
      memberships: membershipUnion,
    },
  },
  memberMinimal: {
    query: {
      fields: Queries.memberFields,
    },
  },
  memberProfile: {
    query: {
      actions: 'all',
      actions_limit: 10,
      actions_display: true,
      organizations: 'all',
      organization_fields: Queries.organizationFieldsMinimal,
      organization_paidAccount: true,
      organization_paidAccount_fields: Queries.paidAccountFieldsMinimal,
      boards: 'open',
      board_fields: 'name,prefs,idOrganization',
      paidAccount: true,
      paidAccount_fields: Queries.paidAccountFieldsMinimal,
    },
  },
  memberProfile_daysBack: 30,
  organization: {
    query: {
      boards: 'open',
      board_fields: Queries.boardFieldsMinimal,
      enterprise: true,
      fields: 'all',
      members: 'all',
      member_fields: Queries.memberFields,
      membersInvited: 'all',
      membersInvited_fields: Queries.memberFields,
      paidAccount: true,
      paidAccount_fields: Queries.paidAccountFieldsMinimal,
    },
    mappingRules: {
      boards: orgBoardsMapping,
    },
  },
  organizationExports: {
    query: {
      exports: true,
      fields: 'all',
      paidAccount: true,
      paidAccount_fields: Queries.paidAccountFieldsMinimal,
      enterprise: true,
    },
  },
  organizationMembers: {
    query: {
      fields: [Queries.organizationBoardsFields, 'memberships'].join(','),
      members: 'all',
      member_fields: Queries.memberFields,
      member_activity: true,
      membersInvited: 'all',
      membersInvited_fields: Queries.memberFields,
      paidAccount: true,
      paidAccount_fields: Queries.paidAccountFieldsMinimal,
      enterprise: true,
      tags: true,
    },
  },
  organizationMembersWithAvailableLicenseCount: {
    query: {
      fields: [Queries.organizationBoardsFields, 'availableLicenseCount'].join(
        ',',
      ),
      members: 'all',
      member_fields: Queries.memberFields,
      membersInvited: 'all',
      membersInvited_fields: Queries.memberFields,
      tags: true,
    },
  },
  organizationMembersBoards: {
    query: {
      fields: '',
      boards: 'open',
      board_fields: [MINIMAL_MEMBERSHIPS, 'idOrganization', 'prefs'].join(','),
    },
    mappingRules: {
      boards: orgBoardsMapping,
    },
  },
  organizationMembersCollaborators: {
    query: {
      fields: '',
      collaborators: true,
    },
  },
  organizationMembersMinimal: {
    query: {
      members: 'all',
      fields: [Queries.organizationFieldsMinimal, 'memberships'],
    },
  },
  organizationFieldsMinimalWithAvailableLicenseCount: {
    query: {
      members: 'all',
      fields: [
        [Queries.organizationFieldsMinimal, 'memberships'],
        'availableLicenseCount',
      ],
    },
  },
  organizationFieldsMaximumAndAvailableLicenseCount: {
    query: {
      fields: ['availableLicenseCount', 'maximumLicenseCount'],
    },
  },
  organizationMinimal: {
    query: {
      fields: 'all',
      tags: true,
    },
  },
  organizations: {
    query: {
      organizations: 'all',
      organization_paidAccount: true,
      organization_paidAccount_fields: Queries.paidAccountFieldsMinimal,
    },
  },
  organizationsWithoutBoards: {
    query: {
      organizations: 'all',
      organization_fields: 'name,displayName,logoHash,products,memberships',
      fields: '',
    },
  },
  organizationsMinimal: {
    query: {
      organizations: 'all',
      organization_fields: 'products,memberships',
      fields: '',
    },
  },
  organizationsMemberships: {
    query: {
      organizations: 'all',
      organization_fields: 'memberships',
    },
  },
  organizationCredits: {
    query: {
      credits: 'all',
      fields: 'id',
    },
  },
  idCard: {
    query: {
      fields: '',
      checkItemStates: false,
    },
  },
  cardsAndListsMinimal: {
    query: {
      lists: 'open',
      list_fields: 'name,pos,idBoard,closed,limits',
      cards: 'visible',
      card_fields: 'idList,idBoard,pos,closed',
      // eslint-disable-next-line @trello/no-module-logic
      fields: [...Array.from(DefaultBoardFields), 'limits'].join(','),
    },
  },
  listsMinimal: {
    query: {
      lists: 'open',
      list_fields: 'name,pos,idBoard,closed',
      fields: 'limits',
    },
  },
  listMinimal: {
    query: {
      fields: 'name,pos,idBoard,closed',
    },
  },
  archivedLists: {
    query: {
      fields: 'id',
      lists: 'closed',
      list_fields: 'name,pos,idBoard,closed',
    },
  },
  archivedListsAndCards: {
    query: {
      lists: 'closed',
      list_fields: 'name,pos,idBoard,closed',
      cards: 'open',
      card_fields: 'idList,idBoard,badges,pos,closed',
    },
  },
  listCards: {
    query: {
      cards: 'open',
      card_fields: 'idList,idBoard,badges,pos,closed,name',
    },
  },
  action: {
    query: {
      display: true,
      memberCreator: true,
    },
  },
  memberOrganizationDeactivatedMembers: {
    query: {
      fields: Queries.organizationFieldsMinimal,
      memberships: 'deactivated',
    },
    mappingRules: {
      memberships: membershipUnion,
    },
  },
  pendingOrganizations: {
    mappingRules: {
      // The `memberRequestor` field gets detected by ModelCache
      // as a nested Member model, and will be removed from the
      // returned models. This mapping rule is in place to just stick that
      // field back on the models.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      memberRequestor(memberRequestor: any, model: Model) {
        return model.set('memberRequestor', memberRequestor);
      },
    },
  },
  workspaceBoardsPage: {
    query: {
      boards: 'open',
      board_fields: Queries.boardFieldsInLargeOrganization,
      fields: Queries.organizationBoardsFields,
      paidAccount: true,
      paidAccount_fields: Queries.paidAccountFieldsMinimal,
      enterprise: true,
      tags: true,
      memberships: 'active',
      billableCollaboratorCount: true,
    },
    mappingRules: { boards: orgBoardsMapping },
  },
  workspaceBoardsPageMinimal: {
    query: Queries.workspaceBoardsPageMinimal,
    mappingRules: { boards: orgBoardsMapping },
  },
};

// eslint-disable-next-line import/no-default-export
export default Payloads;
