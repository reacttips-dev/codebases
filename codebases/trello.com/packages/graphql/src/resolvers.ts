import {
  restResourceResolver,
  batchRestResourceResolver,
} from './restResourceResolver/restResourceResolver';
import {
  announcementsResolver,
  dismissAnnouncement,
} from './resolvers/announcements';
import {
  uploadCardCover,
  updateCardDueComplete,
  updateCardCover,
  updateCardList,
  createCardTemplate,
  createCard,
  copyCard,
  archiveCard,
  unarchiveCard,
  deleteCard,
  changeCardDueDate,
  updateCardDates,
  updateCardRole,
  updateCardName,
  possibleCardRoleResolver,
} from './resolvers/card';
import {
  addChecklist,
  deleteChecklist,
  updateChecklistName,
  updateChecklistPos,
} from './resolvers/checklist';
import {
  addCheckItem,
  deleteCheckItem,
  updateCheckItemDueDate,
  updateCheckItemName,
  updateCheckItemPos,
  updateCheckItemState,
} from './resolvers/checkItem';
import { emailProviderResolver } from './resolvers/emailProvider';
import { createList } from './resolvers/list';
import {
  addBoardStar,
  removeBoardStar,
  addOneTimeMessagesDismissed,
  updateUserLocale,
  updateTeamifyVoluntaryDone,
  deleteOneTimeMessagesDismissed,
  prepMemberForAtlassianAccountOnboarding,
  prepMemberForEmailHygiene,
  memberAgreementsResolver,
  memberAtlassianAccountsResolver,
  memberAtlassianOrganizationsResolver,
  memberGuestOrganizationsResolver,
  memberCardsResolver,
  acceptDeveloperTerms,
  updateMemberAvatarSource,
  uploadMemberAvatar,
  addCampaign,
  updateCampaign,
  resendVerificationEmail,
  changeMemberEmail,
  updateMemberActiveChannel,
} from './resolvers/member';
import {
  addFreeTrial,
  applyBCDiscount,
  organizationOwnedPluginsResolver,
  organizationStatsResolver,
  organizationCardStatsResolver,
  organizationLabelNamesResolver,
  organizationNewBillableGuestsResolver,
  createOrganization,
  copyBoardToOrg,
  deleteOrganizationLogo,
  addMembersToOrg,
  removeMembersFromWorkspace,
  updateOrganization,
  uploadOrganizationImage,
  organizationCardsResolver,
  organizationMemberCardsResolver,
  organizationBoardsResolver,
  addTag,
} from './resolvers/organization';
import {
  upgradePriceQuotesResolver,
  newSubscriptionListPriceQuotesResolver,
  newSubscriptionPriceQuotesResolver,
  renewalPriceQuotesResolver,
  statementsResolver,
  createWorkspacePaidAccount,
  addMembersPriceQuotesResolver,
  createGoldPaidAccount,
  certCaptureTokenResolver,
  activateGoldCredit,
  reactivateWorkspacePaidAccount,
  reactivateGoldPaidAccount,
  updateCreditCardFactory,
  updatePaidProductFactory,
  updateBillingContactDetailsFactory,
  updateInvoiceDetailsFactory,
  cancelPaidAccountFactory,
} from './resolvers/paidAccount';
import {
  publicPluginsResolver,
  pluginCategoriesResolver,
} from './resolvers/publicPlugin';
import { unsplashPhotosResolver } from './resolvers/unsplash';
import { addButlerButton, deleteButlerButton } from './resolvers/butlerButton';
import {
  createCustomField,
  enablePlugin,
  updateBoardOrg,
  updateBoardVisibility,
  updateBoardCardCoversPref,
  boardExportResolver,
  startBoardExport,
  statsResolver,
  boardDashboardViewTileResolver,
  updateCalendarKey,
  updateCalendarFeedEnabledPref,
} from './resolvers/board';
import {
  createPlugin,
  deletePlugin,
  updatePlugin,
  createPluginListing,
  updatePluginListing,
  deletePluginListing,
  pluginCollaboratorsResolver,
  addPluginCollaborator,
  removePluginCollaborator,
} from './resolvers/plugin';
import {
  templateCategoriesResolver,
  templateLanguagesResolver,
  templateGalleryResolver,
} from './resolvers/template';
import {
  enterpriseClaimableOrganizationsResolver,
  transferrableDataForOrganizationResolver,
  claimOrganization,
  linkEnterpriseWithAtlassianOrganization,
  managedMembersWithTokensResolver,
  deleteManagedMemberTokens,
  deleteAllManagedMemberTokens,
  updateEnterpriseApiTokenCreationPermission,
  auditlogResolver,
} from './resolvers/enterprise';
import { modelTypeResolver } from './resolvers/modelTypeResolver';
import {
  createDashboardViewTile,
  updateDashboardViewTile,
  deleteDashboardViewTile,
} from './resolvers/boardDashboard';
import {
  boardHistoryResolver,
  getCardsPerList,
  getCardsPerLabel,
  getCardsPerMember,
  getCardsPerDueDateStatus,
} from './resolvers/boardHistory';
import { qrCodeResolver } from './resolvers/qrCode';
import {
  createOrganizationView,
  updateOrganizationView,
  updateViewInOrganizationView,
} from './resolvers/organizationView';
import {
  notificationGroupsResolver,
  notificationsCountResolver,
  notificationsResolver,
  setNotificationsRead,
  setAllNotificationsRead,
} from './resolvers/notifications';
import {
  boardAccessRequestResolver,
  sendBoardAccessRequest,
} from './resolvers/requestAccess';
import { Resolvers } from '@apollo/client';

export const queryMap = {
  announcements: announcementsResolver,
  board: restResourceResolver,
  boardAccessRequest: boardAccessRequestResolver,
  boards: batchRestResourceResolver,
  card: restResourceResolver,
  cards: batchRestResourceResolver,
  certCaptureToken: certCaptureTokenResolver,
  checklist: restResourceResolver,
  checklists: batchRestResourceResolver,
  list: restResourceResolver,
  lists: batchRestResourceResolver,
  atlassianAccounts: memberAtlassianAccountsResolver,
  emailProvider: emailProviderResolver,
  member: restResourceResolver,
  modelType: modelTypeResolver,
  members: batchRestResourceResolver,
  memberCards: memberCardsResolver,
  notificationGroups: notificationGroupsResolver,
  notifications: notificationsResolver,
  notificationsCount: notificationsCountResolver,
  organization: restResourceResolver,
  organizations: batchRestResourceResolver,
  organizationMemberCards: organizationMemberCardsResolver,
  organizationView: restResourceResolver,
  organizationViews: batchRestResourceResolver,
  label: restResourceResolver,
  labels: batchRestResourceResolver,
  enterprise: restResourceResolver,
  enterprises: batchRestResourceResolver,
  publicPlugins: publicPluginsResolver,
  newSubscriptionListPriceQuotes: newSubscriptionListPriceQuotesResolver,
  newSubscriptionPriceQuotes: newSubscriptionPriceQuotesResolver,
  upgradePriceQuotes: upgradePriceQuotesResolver,
  renewalPriceQuotes: renewalPriceQuotesResolver,
  statements: statementsResolver,
  addMembersPriceQuotes: addMembersPriceQuotesResolver,
  search: restResourceResolver,
  plugin: restResourceResolver,
  plugins: batchRestResourceResolver,
  pluginCategories: pluginCategoriesResolver,
  qrCode: qrCodeResolver,
  unsplashPhotos: unsplashPhotosResolver,
  templateCategories: templateCategoriesResolver,
  templateLanguages: templateLanguagesResolver,
  templateGallery: templateGalleryResolver,
};

export const resolvers = {
  Query: queryMap,
  Mutation: {
    addButlerButton,
    addChecklist,
    addOneTimeMessagesDismissed,
    createOrganization,
    copyBoardToOrg,
    updateBoardOrg,
    updateBoardVisibility,
    updateBoardCardCoversPref,
    dismissAnnouncement,
    deleteChecklist,
    updateChecklistName,
    updateChecklistPos,
    addCheckItem,
    deleteCheckItem,
    addCampaign,
    updateCampaign,
    updateCheckItemDueDate,
    updateCheckItemName,
    updateCheckItemPos,
    updateCheckItemState,
    addBoardStar,
    removeBoardStar,
    updateUserLocale,
    updateTeamifyVoluntaryDone,
    updateOrganization,
    prepMemberForAtlassianAccountOnboarding,
    prepMemberForEmailHygiene,
    deleteOneTimeMessagesDismissed,
    createPlugin,
    deletePlugin,
    enablePlugin,
    updatePlugin,
    createPluginListing,
    updatePluginListing,
    deletePluginListing,
    addPluginCollaborator,
    removePluginCollaborator,
    acceptDeveloperTerms,
    updateMemberAvatarSource,
    updateCardCover,
    uploadCardCover,
    updateCardDueComplete,
    updateCardList,
    updateCardName,
    uploadMemberAvatar,
    changeMemberEmail,
    updateMemberActiveChannel,
    resendVerificationEmail,
    addMembersToOrg,
    removeMembersFromWorkspace,
    createList,
    createCardTemplate,
    createCard,
    copyCard,
    archiveCard,
    unarchiveCard,
    deleteCard,
    changeCardDueDate,
    updateCardDates,
    startBoardExport,
    claimOrganization,
    createCustomField,
    linkEnterpriseWithAtlassianOrganization,
    createWorkspacePaidAccount,
    createGoldPaidAccount,
    activateGoldCredit,
    reactivateWorkspacePaidAccount,
    reactivateGoldPaidAccount,
    // eslint-disable-next-line @trello/no-module-logic
    updateBusinessClassCreditCard: updateCreditCardFactory('organizations'),
    // eslint-disable-next-line @trello/no-module-logic
    updateGoldCreditCard: updateCreditCardFactory('members'),
    // eslint-disable-next-line @trello/no-module-logic
    updateBusinessClassPaidProduct: updatePaidProductFactory('organizations'),
    // eslint-disable-next-line @trello/no-module-logic
    updateGoldPaidProduct: updatePaidProductFactory('members'),
    // eslint-disable-next-line @trello/no-module-logic
    updateBusinessClassBillingContactDetails: updateBillingContactDetailsFactory(
      'organizations',
    ),
    // eslint-disable-next-line @trello/no-module-logic
    updateGoldBillingContactDetails: updateBillingContactDetailsFactory(
      'members',
    ),
    // eslint-disable-next-line @trello/no-module-logic
    cancelWorkspacePaidAccount: cancelPaidAccountFactory('organizations'),
    // eslint-disable-next-line @trello/no-module-logic
    cancelGoldPaidAccount: cancelPaidAccountFactory('members'),
    // eslint-disable-next-line @trello/no-module-logic
    updateBusinessClassBillingInvoiceDetails: updateInvoiceDetailsFactory(
      'organizations',
    ),
    // eslint-disable-next-line @trello/no-module-logic
    updateGoldBillingInvoiceDetails: updateInvoiceDetailsFactory('members'),
    uploadOrganizationImage,
    deleteOrganizationLogo,
    addFreeTrial,
    applyBCDiscount,
    deleteManagedMemberTokens,
    deleteAllManagedMemberTokens,
    updateEnterpriseApiTokenCreationPermission,
    createDashboardViewTile,
    updateDashboardViewTile,
    deleteDashboardViewTile,
    updateCardRole,
    createOrganizationView,
    updateOrganizationView,
    updateViewInOrganizationView,
    updateCalendarKey,
    updateCalendarFeedEnabledPref,
    addTag,
    setNotificationsRead,
    setAllNotificationsRead,
    deleteButlerButton,
    sendBoardAccessRequest,
  },

  // Custom type resolvers

  Board: {
    export: boardExportResolver,
    exports: boardExportResolver,
    stats: statsResolver,
    dashboardViewTile: boardDashboardViewTileResolver,
    history: boardHistoryResolver,
  },

  Board_History: {
    cardsPerList: getCardsPerList,
    cardsPerLabel: getCardsPerLabel,
    cardsPerMember: getCardsPerMember,
    cardsPerDueDateStatus: getCardsPerDueDateStatus,
  },

  Card: {
    possibleCardRole: possibleCardRoleResolver,
  },

  Enterprise: {
    claimableOrganizations: enterpriseClaimableOrganizationsResolver,
    transferrableData: transferrableDataForOrganizationResolver,
    managedMembersWithTokens: managedMembersWithTokensResolver,
    auditlog: auditlogResolver,
  },

  Member: {
    agreements: memberAgreementsResolver,
    atlassianOrganizations: memberAtlassianOrganizationsResolver,
    guestOrganizations: memberGuestOrganizationsResolver,
  },

  Organization: {
    ownedPlugins: organizationOwnedPluginsResolver,
    stats: organizationStatsResolver,
    newBillableGuests: organizationNewBillableGuestsResolver,
    cards: organizationCardsResolver,
    boards: organizationBoardsResolver,
  },

  Organization_Stats: {
    cards: organizationCardStatsResolver,
    labelNames: organizationLabelNamesResolver,
  },

  Plugin: {
    collaborators: pluginCollaboratorsResolver,
  },
} as Resolvers;
