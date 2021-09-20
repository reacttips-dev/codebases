export const BOARD_FIELDS_MINIMAL = [
  'closed',
  'creationMethod',
  'dateLastActivity',
  'dateLastView',
  'datePluginDisable',
  'enterpriseOwned',
  'id',
  'idOrganization',
  'name',
  'prefs',
  'premiumFeatures',
  'shortLink',
  'shortUrl',
  'url',
];

// eslint-disable-next-line @trello/no-module-logic
export const BOARD_FIELDS = BOARD_FIELDS_MINIMAL.concat([
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
]);

export const BOARD_FIELDS_SEARCH_RESULT = [
  'closed',
  'id',
  'idOrganization',
  'name',
  'prefs',
  'url',
];

export const CARD_FIELDS_MINIMAL = [
  'badges',
  'closed',
  'start',
  'desc', // TODO: Not needed in minimal, but currently used for badge
  'idAttachmentCover',
  'idBoard',
  'idList',
  'idMembers',
  'isTemplate',
  'labels',
  'name',
  'pos',
  'shortLink',
  'url',
];

export const MEMBER_FIELDS_NON_PUBLIC = [
  'avatarUrl',
  'fullName',
  'initials',
  'nonPublic',
];

export const MEMBER_FIELDS_MINIMAL = [
  ...MEMBER_FIELDS_NON_PUBLIC,
  'avatarSource',
  'email',
  'username',
  'bio',
  'prefs',
  'products',
  'loginTypes',
];

export const MEMBER_FIELDS_HEADER = [
  ...MEMBER_FIELDS_MINIMAL,
  'confirmed',
  'idBoards',
  'idEnterprisesAdmin',
  'idOrganizations',
  'idPremOrgsAdmin',
  'marketingOptIn',
  'messagesDismissed',
  'campaigns',
];

export const TEAM_FIELDS_MINIMAL = [
  'name',
  'displayName',
  'products',
  'prefs',
  'premiumFeatures',
  'limits',
  'logoHash',
  'idEnterprise',
  'tags',
  'url',
  'standardVariation',
];

// eslint-disable-next-line @trello/no-module-logic
export const TEAM_FIELDS = TEAM_FIELDS_MINIMAL.concat([
  'desc',
  'descData',
  'website',
  'memberships',
]);
