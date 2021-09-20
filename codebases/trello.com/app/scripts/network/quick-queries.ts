// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const boardFieldsMinimal = [
  'name',
  'closed',
  'dateLastActivity',
  'dateLastView',
  'datePluginDisable',
  'enterpriseOwned',
  'idOrganization',
  'prefs',
  'premiumFeatures',
  'shortLink',
  'shortUrl',
  'url',
  'creationMethod',
  'idEnterprise',
].join(',');

// Used for extremely large board fetches
// dateLastView is not on the board schema which forces us to read from the views collection
// omitting for perf reasons
const boardFieldsExtraMinimal = [
  'name',
  'closed',
  'dateLastActivity',
  'datePluginDisable',
  'enterpriseOwned',
  'idOrganization',
  'prefs',
  'premiumFeatures',
  'shortLink',
  'shortUrl',
  'url',
  'creationMethod',
  'idEnterprise',
].join(',');

const boardFieldsFull = [
  boardFieldsMinimal,
  'desc',
  'descData',
  'idTags',
  'invitations',
  'invited',
  'labelNames',
  'limits',
  'memberships',
  'powerUps',
  'subscribed',
  'templateGallery',
].join(',');

const boardFieldsMinimalSubscribed = [boardFieldsMinimal, 'subscribed'].join(
  ',',
);

const memberFields = [
  'activityBlocked',
  'avatarUrl',
  'bio',
  'bioData',
  'confirmed',
  'fullName',
  'idEnterprise',
  'idMemberReferrer',
  'initials',
  'memberType',
  'nonPublic',
  'products',
  'url',
  'username',
].join(',');

const memberFieldsAndPremOrgsAdmin = [memberFields, 'idPremOrgsAdmin'].join(
  ',',
);

const organizationFieldsMinimal = [
  'name',
  'displayName',
  'products',
  'prefs',
  'premiumFeatures',
  'logoHash',
  'idEnterprise',
  'tags',
  'limits',
  'credits',
].join(',');

const organizationFieldsMinimalMemberships = [
  organizationFieldsMinimal,
  'memberships',
].join(',');

const cardFieldsBulk = [
  'badges',
  'cardRole',
  'closed',
  'dateLastActivity',
  'desc',
  'descData',
  'due',
  'dueComplete',
  'dueReminder',
  'idAttachmentCover',
  'idList',
  'idBoard',
  'idMembers',
  'idShort',
  'idLabels',
  'limits',
  'name',
  'pos',
  'shortUrl',
  'shortLink',
  'subscribed',
  'url',
  'locationName',
  'address',
  'coordinates',
  'cover',
  'isTemplate',
  'start',
].join(',');

const boardFieldsInOrganization = [boardFieldsMinimal, 'idTags'].join(',');
const boardFieldsInLargeOrganization = [boardFieldsExtraMinimal, 'idTags'].join(
  ',',
);

const organizationBoardsFields = [
  organizationFieldsMinimal,
  'desc',
  'descData',
  'website',
  'limits',
  'billableCollaboratorCount',
].join(',');

const paidAccountFieldsMinimal = [
  'products',
  'standing',
  'billingDates',
  'expirationDates',
  'needsCreditCardUpdate',
  'dateFirstSubscription',
  'scheduledChange',
  'trialExpiration',
].join(',');

const cardActions = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToCard',
  'commentCard',
  'copyCommentCard',
  'convertToCardFromCheckItem',
  'createCard',
  'copyCard',
  'deleteAttachmentFromCard',
  'emailCard',
  'moveCardFromBoard',
  'moveCardToBoard',
  'removeChecklistFromCard',
  'removeMemberFromCard',
  'updateCard:idList',
  'updateCard:closed',
  'updateCard:due',
  'updateCard:dueComplete',
  'updateCheckItemStateOnCard',
  'updateCustomFieldItem',
].join(',');

const boardActions = [
  cardActions,
  'addMemberToBoard',
  'addToOrganizationBoard',
  'copyBoard',
  'createBoard',
  'createCustomField',
  'createList',
  'deleteCard',
  'deleteCustomField',
  'disablePlugin',
  'disablePowerUp',
  'enablePlugin',
  'enablePowerUp',
  'makeAdminOfBoard',
  'makeNormalMemberOfBoard',
  'makeObserverOfBoard',
  'moveListFromBoard',
  'moveListToBoard',
  'removeFromOrganizationBoard',
  'unconfirmedBoardInvitation',
  'unconfirmedOrganizationInvitation',
  'updateBoard',
  'updateCustomField',
  'updateList:closed',
].join(',');

const card = {
  fields: 'all',
  stickers: true,
  attachments: true,
  customFieldItems: true,
  pluginData: true,
};

const currentBoardMinimal = {
  lists: 'open',
  list_fields:
    'name,closed,idBoard,pos,subscribed,limits,creationMethod,softLimit',
  cards: 'visible',
  card_attachments: 'cover',
  card_stickers: true,
  card_fields: [cardFieldsBulk, 'labels'].join(','),
  card_checklists: 'none',
  enterprise: true,
  enterprise_fields: 'displayName',
  members: 'all',
  member_fields: memberFields,
  membersInvited: 'all',
  membersInvited_fields: memberFields,
  memberships_orgMemberType: true,
  checklists: 'none',
  organization: true,
  organization_fields:
    'name,displayName,desc,descData,url,website,prefs,memberships,logoHash,products,limits,idEnterprise,premiumFeatures',
  organization_tags: true,
  organization_enterprise: true,
  organization_disable_mock: true,
  myPrefs: true,
  fields: boardFieldsFull,
  pluginData: true,
  organization_pluginData: true,
  boardPlugins: true,
};

const currentBoardSecondary = {
  fields: '',
  actions: boardActions,
  actions_display: true,
  actions_limit: 50,
  action_memberCreator_fields: memberFieldsAndPremOrgsAdmin,
  action_reactions: true,
  checklists: 'none',
  cards: 'visible',
  card_fields: '',
  card_checklists: 'all',
  card_checklist_checkItems: 'none',
  labels: 'all',
  labels_limit: 1000,
};

const currentBoardPluginData = {
  fields: '',
  boardPlugins: true,
  cards: 'visible',
  card_fields: '',
  card_attachments: true,
  card_attachment_fields:
    'bytes,date,edgeColor,idMember,isUpload,mimeType,name,url',
  card_customFieldItems: true,
  customFields: true,
  card_pluginData: true,
  organization: true,
  organization_fields: '',
};

const memberBoards = {
  boards: 'open,starred',
  board_fields: boardFieldsMinimalSubscribed,
  boardStars: true,
  boardsInvited: 'all',
  boardsInvited_fields: boardFieldsMinimalSubscribed,
  board_organization: true,
  board_organization_fields: organizationFieldsMinimal,
  credits: 'invitation,promoCode',
  organizations: 'all',
  organization_fields: organizationFieldsMinimalMemberships,
  organizationsInvited: 'all',
  organizationsInvited_fields: organizationFieldsMinimal,
  organization_paidAccount: true,
  organization_paidAccount_fields: paidAccountFieldsMinimal,
  paidAccount: true,
  paidAccount_fields: paidAccountFieldsMinimal,
};

const memberHeader = {
  campaigns: true,
  channels: true,
  logins: true,
  organizations: 'all',
  organization_paidAccount: true,
  organization_paidAccount_fields: paidAccountFieldsMinimal,
  organization_fields: 'name,displayName,idEnterprise,products',
  organization_enterprise: true,
  paidAccount: true,
  paidAccount_fields: paidAccountFieldsMinimal,
  pluginData: true,
  savedSearches: true,
  missedTransferDate: true,
  enterpriseToExplicitlyOwnBoards: true,
  enterpriseLicenses: true,
  enterprises: true,
  enterprise_filter: ['saml', 'member', 'member-unconfirmed', 'owned'],
  enterprise_fields:
    'name,displayName,isRealEnterprise,idAdmins,organizationPrefs',
  enterpriseWithRequiredConversion: true,
};

const organizationBoardsPage = {
  boards: 'open',
  board_fields: boardFieldsInOrganization,
  board_starCounts: 'organization',
  board_membershipCounts: 'active',
  fields: organizationBoardsFields,
  paidAccount: true,
  paidAccount_fields: paidAccountFieldsMinimal,
  enterprise: true,
  memberships: 'active',
  members: 'all',
  tags: true,
  billableCollaboratorCount: true,
};

const workspaceBoardsPageMinimal = {
  boards: 'open',
  boards_count: 29,
  boards_sortBy: 'dateLastActivity',
  boards_sortOrder: 'desc',
  board_fields: boardFieldsInLargeOrganization,
  fields: organizationBoardsFields,
  paidAccount: true,
  paidAccount_fields: paidAccountFieldsMinimal,
  enterprise: true,
  tags: true,
  memberships: 'active',
  billableCollaboratorCount: true,
};

const memberQuickBoards = {
  fields: 'idOrganizations',
  boards: 'open,starred',
  board_fields: boardFieldsMinimal,
  boardStars: true,
  organizations: 'all',
  organization_fields: 'idBoards',
};

const quickBoardsSearch = (search: string) => ({
  query: search,
  modelTypes: 'boards',
  board_fields: boardFieldsMinimal,
  partial: true,
});
const boardMinimalForDisplayCard = {
  lists: 'open',
  list_fields:
    'name,closed,idBoard,pos,subscribed,limits,creationMethod,softLimit',
  enterprise: true,
  enterprise_fields: 'displayName',
  members: 'all',
  member_fields: memberFields,
  membersInvited: 'all',
  membersInvited_fields: memberFields,
  memberships_orgMemberType: true,
  organization: true,
  organization_fields:
    'name,displayName,desc,descData,url,website,prefs,memberships,logoHash,products,limits,idEnterprise',
  organization_tags: true,
  organization_enterprise: true,
  organization_disable_mock: true,
  myPrefs: true,
  fields: boardFieldsFull,
  labels: 'all',
  labels_limit: 1000,
};

const Queries: {
  boardFieldsInLargeOrganization: string;
  boardFieldsMinimal: string;
  boardFieldsFull: string;
  boardFieldsMinimalSubscribed: string;
  memberFields: string;
  memberFieldsAndPremOrgsAdmin: string;
  organizationFieldsMinimal: string;
  organizationFieldsMinimalMemberships: string;
  paidAccountFieldsMinimal: string;
  cardFieldsBulk: string;
  boardFieldsInOrganization: string;
  organizationBoardsFields: string;
  cardActions: string;
  boardActions: string;
  card: object;
  currentBoardMinimal: object;
  currentBoardSecondary: object;
  currentBoardPluginData: object;
  memberBoards: object;
  memberHeader: object;
  organizationBoardsPage: object;
  memberQuickBoards: object;
  quickBoardsSearch: (search: string) => object;
  boardMinimalForDisplayCard: object;
  workspaceBoardsPageMinimal: object;
} = {
  boardFieldsInLargeOrganization,
  boardFieldsMinimal,
  boardFieldsFull,
  boardFieldsMinimalSubscribed,
  memberFields,
  memberFieldsAndPremOrgsAdmin,
  organizationFieldsMinimal,
  organizationFieldsMinimalMemberships,
  paidAccountFieldsMinimal,
  cardFieldsBulk,
  boardFieldsInOrganization,
  organizationBoardsFields,
  cardActions,
  boardActions,
  card,
  currentBoardMinimal,
  currentBoardSecondary,
  currentBoardPluginData,
  memberBoards,
  memberHeader,
  organizationBoardsPage,
  memberQuickBoards,
  quickBoardsSearch,
  boardMinimalForDisplayCard,
  workspaceBoardsPageMinimal,
};

// eslint-disable-next-line import/no-default-export
export default Queries;
