export const TEST_ID_ATTR = 'data-test-id';
export const TEST_ID_SELECTOR = `[${TEST_ID_ATTR}]`;

export enum HeaderTestIds {
  Container = 'header-container',
  HomeButton = 'header-home-button',

  AtlassianAppSwitcher = 'atlassian-app-switcher',

  BoardsMenuButton = 'header-boards-menu-button',
  BoardsMenuPopover = 'header-boards-menu-popover',
  BoardsMenuSearch = 'header-boards-menu-search',
  BoardsMenuCreateBoard = 'header-boards-menu-create-board',
  BoardsMenuPin = 'header-boards-menu-pin',
  BoardsMenuOpenClosed = 'header-boards-menu-open-closed',

  CreateMenuButton = 'header-create-menu-button',
  CreateMenuPopover = 'header-create-menu-popover',

  CreateBoardButton = 'header-create-board-button',
  CreateBoardFromTemplateButton = 'header-create-board-from-template-button',
  CreateTeamButton = 'header-create-team-button',
  CreateBusinessTeamButton = 'header-create-business-team-button',
  CreateEnterpriseTeamButton = 'header-create-enterprise-team-button',

  InfoButton = 'header-info-button',

  NotificationsButton = 'header-notifications-button',
  NotificationsPopover = 'header-notifications-popover',
  NotificationsEmailFrequency = 'header-notifications-email-frequency',

  EnterpriseDashboardButton = 'header-enterprise-dashboard-button',

  ChannelPickerButton = 'header-channel-picker-button',
  ChannelPickerPopover = 'header-channel-picker-popover',

  MemberMenuButton = 'header-member-menu-button',
  MemberMenuPopover = 'header-member-menu-popover',
  MemberMenuLogout = 'header-member-menu-logout',
  MemberMenuProfile = 'header-member-menu-profile',
  MemberMenuCards = 'header-member-menu-cards',
  MemberMenuSettings = 'header-member-menu-settings',
  MemberMenuLanguage = 'header-member-menu-lang',
  MemberMenuLanguageEn = 'header-member-menu-lang-en',
  MemberMenuLanguageJa = 'header-member-menu-lang-ja',

  SearchInput = 'header-search-input',
  SearchPopover = 'header-search-popover',
  SearchTips = 'header-search-tips',
  SearchClose = 'header-search-close',
}

export enum CreateBoardTestIds {
  CreateBoardTile = 'create-board-tile',
  CreateBoardTitleInput = 'create-board-title-input',
  CreateBoardSubmitButton = 'create-board-submit-button',
  CreateBoardBlueBackground = 'create-board-bg-item-blue',
}

export enum HomeTestIds {
  BoardsListViewsPopoverButton = 'home-boards-list-team-views-header-button',
  BoardsListViewsPopoverMyWorkButton = 'home-boards-list-team-views-my-work-button',
  BoardsListViewsPopoverCustomViewButton = 'home-boards-list-team-views-custom-view-button',
  CardTitle = 'home-card-title',
  DismissOrientationCard = 'home-dismiss-orientation-card-',
  HighlightsList = 'home-highlights-list',
  HomeLink = 'home-link',
  UpNextShowMoreBtn = 'home-up-next-show-more-button',
  NavigationCreateTeamButton = 'home-navigation-create-team-button',
  TeamTabName = 'home-team-tab-name',
  TeamTabSection = 'home-team-tab-section-',
  UpNextList = 'home-up-next-list',
  UpNextSectionHeader = 'home-up-next-section-header',
  Templates = 'templates',
  Tile = 'home-tile-',
  TileSecondaryButton = 'home-tile-secondary-button-',
  StarredBoardsContainer = 'home-starred-boards-container',
  RecentlyViewedBoardsContainer = 'home-recently-viewed-boards-container',
  CustomViewTab = 'home-team-custom-view-tab',
  FreeTeamGettingStartedTab = 'home-free-team-getting-started-tab',
  MyWorkTab = 'home-team-my-work-tab',
  TeamGettingStartedTab = 'home-team-getting-started-tab',
  TeamHighlightsTab = 'home-team-highlights-tab',
  TeamBoardsTab = 'home-team-boards-tab',
  TeamCollectionsTab = 'home-team-collections-tab',
  TeamTablesTab = 'home-team-tables-tab',
  TeamMembersTab = 'home-team-members-tab',
  TeamSettingsTab = 'home-team-settings-tab',
  TeamReportsTab = 'home-team-reports-tab',
}

export enum BadgesTestIds {
  DueDateBadgeCompleted = 'badge-due-date-completed',
  DueDateBadgeNotCompleted = 'badge-due-date-not-completed',
  ChecklistBadge = 'checklist-badge',
  CardAttachmentsCount = 'card-attachments-count',
  CardSubscribed = 'badge-card-subscribed',
  CardVotesCount = 'badge-card-votes-count',
}

export enum CanonicalCard {
  BoardName = 'cards-board-name',
  ListName = 'cards-list-name',
  DueDateBadgeCompleted = 'badge-card-subscribed',
  OverflowDetailsButton = 'overflow-details-button',
  CommentDismissButton = 'comment-dismiss-button',
}

export enum NotificationTestIds {
  Reaction = 'notification-reaction-',
  ToggleArchive = 'notification-toggle-archive',
  HideArchive = 'notification-hide-archive',
  NotificationsEmptyState = 'notifications-empty-state',
  NotificationsEmptyStateHidden = 'notifications-empty-state-hidden',
  ToggleReadButton = 'toggle-read-button',
  ToggleUnreadButton = 'toggle-unread-button',
  ViewAll = 'view-all',
  FilterByUnread = 'filter-by-unread',
  MarkAllReadButton = 'mark-all-read-button',
  UnreadNotification = 'unread-notification',
  ReadNotification = 'read-notification',
  CommentContainer = 'comment-container',
}

export enum PowerUpTestIds {
  AddPowerUpButton = 'pup-add-button',
  PowerUpsList = 'pup-list',
  LargePowerUpIcon = 'pup-large-icon',
  BoardSelector = 'pup-board-selector',
  AddToBoardButton = 'pup-add-to-board-button',
  SuccessHeading = 'pup-success-heading',
  GoToBoardButton = 'pup-go-to-board-button',
  EnabledPowerUpsLink = 'enabled-powerups-link',
  DisablePowerUpLink = 'disable-powerup-link',
}

export enum NavigationTestIds {
  SearchInput = 'nav-search-input',
}

export enum MemberBoardsTestIds {
  CreateWorkspaceOverlay = 'create-workspace-overlay',
}

export enum TeamTestIds {
  TeamMembersLink = 'team-members-link',
  CreateTeamNameInput = 'header-create-team-name-input',
  CreateTeamTypeInput = 'header-create-team-type-input',
  CreateTeamTypeOtherOption = 'header-create-team-type-input-other',
  CreateTeamSubmitButton = 'header-create-team-submit-button',
  ShowLaterButton = 'show-later-button',
  AddMemberInput = 'add-members-input',
  TeamInviteeOption = 'team-invitee-option',
  TeamInviteSubmitButton = 'team-invite-submit-button',
  OrgMembersList = 'org-members-list',
  CreateCollectionLink = 'create-collection-link',
  CollectionButton = 'collection-button',
}

export enum TeamTestClasses {
  AddCollectionButton = 'add-collection-button',
}

export enum CreateFirstBoardIds {
  BoardNameInput = 'board-name-input',
  BoardNameDisplay = 'board-name-display',
  ListNameInput = 'list-name-input',
  ListNameDisplay = 'list-name-display',
  CardNameInput = 'card-name-input',
  CardNameDisplay = 'card-name-display',
  ChecklistInput = 'checklist-field',
  ChecklistDisplay = 'checklist-display',
  ContinueButton = 'continue-button',
}
export enum BoardTileTestIds {
  BoardTileContainer = 'board-tile-container',
  BoardTileLink = 'board-tile-link',
  BoardTileName = 'board-tile-name',
}

export enum PopoverTestIds {
  ClosePopover = 'popover-close',
}

export enum MoonshotTestIds {
  BillingSkip = 'moonshot-billing-skip-cta',
  ContinueButton = 'moonshot-continue-button',
  CreateTeamInput = 'moonshot-create-team-input',
  CreateWorkspaceInput = 'moonshot-create-workspace-input',
  MoonshotBox = 'moonshot-box',
  MoonshotBillingFreeTrialHeading = 'moonshot-billing-free-trial-heading',
  MoonshotTryBCFreeTrial = 'moonshot-try-bc-free-trial',
  StartForFreeButton = 'moonshot-start-free-account',
  SuccessButton = 'moonshot-success-button',
  TeamNameError = 'moonshot-team-name-error',
  TeamTypeSelect = 'moonshot-team-type-select',
  TeamTypeError = 'moonshot-team-type-error',
  WelcomeHeading = 'moonshot-welcome-heading',
  WorkspaceNameError = 'moonshot-team-type-error',
}

export enum SlackCodesTestIds {
  BillingFormPromoCode = 'slack-codes-promo-code-billing-field',
}

export enum CardBackTestIds {
  ArchivedBanner = 'card-back-archive-banner',
}

export enum BoardHeaderTestIds {
  BoardViewsSwitcherButton = 'board-views-switcher-button',
  BoardViewsSwitcherNewPill = 'board-views-switcher-new-pill',
  BoardViewsSwitcherCallout = 'board-views-switcher-callout',
  BoardViewsSwitcherCalloutClose = 'boad-views-switcher-callout-close',
  BoardViewsSwitcherUpsellPrompt = 'board-views-switcher-upsell-prompt',
  BoardViewOption = 'board-view-option',
  CalendarViewOption = 'calendar-view-option',
  CalendarViewOptionUpsell = 'calendar-view-option-upsell',
  ChangeTeamSelectLabel = 'change-team-select-label',
  DashboardViewOption = 'dashboard-view-option',
  MapViewOption = 'map-view-option',
  MapViewOptionUpsell = 'map-view-option-upsell',
  TeamTableViewOption = 'team-table-view-option',
  TeamTableMyWorkOption = 'team-table-view-my-work-option',
  TeamTableCustomViewOption = 'team-table-custom-view-option',
  TimelineViewOption = 'timeline-view-option',
  UpsellPromptLearnMoreLink = 'board-views-upsell-prompt-learn-more-link',
  UpsellPromptUpgradeBCButton = 'board-views-upsell-prompt-upgrade-bc-button',
  UpsellPromptStartFreeTrialButton = 'board-views-upsell-prompt-start-free-trial-button',
}

export enum EnterpriseDashboardTestIds {
  SearchCloseIcon = 'search-close-icon',
  PendingTeamItem = 'pending-team-item',
  PendingTeamItemApproveButton = 'pending-team-item-approve-button',
  PendingTeamItemDeclineButton = 'pending-team-item-decline-button',
  PendingTeamItemOverlayApproveButton = 'pending-team-item-overlay-approve-button',
  PendingTeamItemOverlayDeclineButton = 'pending-team-item-overlay-decline-button',
  PendingTeamItemRestrictedMember = 'pending-team-item-restricted-member',
  PendingTeamItemRestrictedMemberDeactivatedBadge = 'pending-team-item-restricted-member-deactivated-badge',
  NewBillableMembers = 'new-billable-members',
  RestrictedMembers = 'restricted-members',
  NewBillableMembersList = 'new-billable-member-list',
  RestrictedMembersList = 'restricted-member-list',
  SortOptionButton = 'sort-option-button',
  SortOptionSelectedMarker = 'sort-option-selected-marker',
  AutoJoinCheckbox = 'auto-join-checkbox',
  BulkBoardActionOptionTeam = 'bulk-board-action-option-team',
  BulkBoardActionOptionEnterprise = 'bulk-board-action-option-enterprise',
  BulkBoardActionOptionPrivate = 'bulk-board-action-option-private',
}

export enum OrganizationViewTestIds {
  EnterpriseText = 'enterprise-text',
  BusinessClassText = 'business-class-text',
  StandardText = 'standard-text',
}

export enum PurchaseFormIds {
  PurchaseForm = 'purchase-form',
  PurchaseFormAnnualButton = 'purchase-form-annual-button',
  PurchaseFormAnnualButtonSelected = 'purchase-form-annual-button-selected',
  PurchaseFormMonthlyButton = 'purchase-form-monthly-button',
  PurchaseFormMonthlyButtonSelected = 'purchase-form-monthly-button-selected',
  CreditCardNumberInput = 'credit-card-number',
  CreditCardExpirationInput = 'credit-card-expiration',
  CreditCardCVVInput = 'credit-card-cvv',
  CreditCardCountrySelect = 'credit-card-country',
  CreditCardZipCodeInput = 'credit-card-zip-code',
  CreditCardTaxIdLabel = 'credit-card-tax-id-label',
  CreditCardTaxIdInput = 'credit-card-tax-id',
  CreditCardTaxIdValidationError = 'credit-card-tax-id-validation-error',
  CreditCardUpdatePopover = 'credit-card-update-popover',
  CreditCardUpdateSubmitButton = 'credit-card-update-submit-button',
  TermsOfServiceContainer = 'terms-of-service',
  TermsOfServiceValidationError = 'terms-of-service-validation-error',
  PurchaseFormSummaryLicense = 'purchase-form-summary-license',
  PurchaseFormSummarySubtotal = 'purchase-form-summary-subtotal',
  PurchaseFormSummaryTaxError = 'purchase-form-summary-tax-error',
  PurchaseFormSummaryTaxRegion = 'purchase-form-summary-tax-region',
  PurchaseFormSummaryTaxAmount = 'purchase-form-summary-tax-amount',
  PurchaseFormSummaryPendingInvitations = 'purchase-form-summary-pending-invitations',
  PurchaseFormSummaryPendingPrice = 'purchase-form-summary-pending-price',
  PurchaseFormSummaryDiscount = 'purchase-form-summary-discount',
  PurchaseFormSummaryDiscountValue = 'purchase-form-summary-discount-value',
  PurchaseFormSummaryFreeTrialDiscount = 'purchase-form-summary-free-trial-discount',
  PurchaseFormSummaryTotal = 'purchase-form-summary-total',
  PurchaseFormSubmitButton = 'purchase-form-submit-button',
  PurchaseFormSubmitError = 'purchase-form-submit-error',
  PurchaseFormAuthorizing = 'purchase-form-authorizing',
}

export enum BillingIds {
  BillingStatusBanner = 'billing-status-banner',
  BillingNextCharge = 'billing-next-charge',
  BillingSwitchToAnnualButton = 'billing-switch-to-annual',
  BillingSwitchToAnnualConfirmButton = 'billing-switch-to-annual-confirm',
  BillingPaymentMethod = 'billing-payment-method',
  BillingContact = 'billing-contact',
  BillingTaxExemption = 'billing-tax-exemption',
  BillingAdditionalInfo = 'billing-additional-info',
  BillingHistoryStatement = 'billing-history-statement',
  BillingCancelAccountButton = 'billing-cancel-account-button',
  BillingCancelFeatureList = 'billing-cancel-feature-list',
  BillingCancelActiveBoardsList = 'billing-cancel-active-boards-list',
  BillingCancelKeepAccountButton = 'billing-cancel-keep-account-button',
  BillingCancelApplyDiscountButton = 'billing-cancel-apply-discount-button',
  BillingCancelTeamBoardsButton = 'billing-cancel-team-boards-button',
  BillingCancelSwitchFreeButton = 'billing-cancel-switch-free-button',
  BillingCancelSurvey = 'billing-cancel-survey',
  BillingCancelNoThanksButton = 'billing-cancel-no-thanks-button',
  BillingCancelGiveFeedback = 'billing-cancel-give-feedback',
  BillingCancelDiscountApplied = 'billing-cancel-discount-applied',
  BillingCancelDiscountDismissButton = 'billing-cancel-discount-dismiss-button',
  BillingSubscriptionCancelled = 'billing-subscription-cancelled',
  BillingSubscriptionRenew = 'billing-subscription-renew',
  BillingCancelled = 'billing-cancelled',
  GetStandard = 'get-standard',
  GoldFromBCMessage = 'gold-from-bc-message',
  RedeemGoldBanner = 'redeem-gold-banner',
  SunsetGoldHeader = 'sunset-gold-header',
  SunsetGoldText = 'sunset-gold-text',
  SunsetOldBCButton = 'sunset-old-bc-button',
  SunsetOldBCHeader = 'sunset-old-bc-header',
  SunsetOldBCIntro = 'sunset-old-bc-intro',
  WelcomeToGoldBanner = 'welcome-to-gold-banner',
  UpgradeTeamBCButton = 'upgrade-team-bc-button',
  UpgradeTeamStandardButton = 'upgrade-team-standard-button',
  UpgradeButton = 'upgrade-team-button',
}

export enum SelectTestIds {
  MoveBoardSelect = 'move-board-select',
}

export enum SelectTestClasses {
  BoardTile = 'board-tile',
}

export enum FreeTrialTestIds {
  ActiveFreeTrialBanner = 'active-free-trial-banner',
  BannerAddPaymentButton = 'banner-add-payment-button',
  ExpiredFreeTrialBanner = 'expired-free-trial-banner',
  HaveBCPlanSelection = 'have-bc-plan-selection',
  LearnMoreAboutBCButton = 'learn-more-about-bc-button',
  LearnMoreBannerLink = 'learn-more-banner-link',
  StartFreeTrialButton = 'start-free-trial-button',
  TryBCPlanSelection = 'try-bc-plan-selection',
  ExplorePlansButton = 'explore-plans-button',
  AddPaymentMethodButton = 'add-payment-method-button',
  SummaryItem = 'free-trial-summary-item',
  StandardStartPremiumFreeTrialButton = 'standard-start-premium-free-trial-button',
  StandardLearnMoreAboutPremiumButton = 'standard-learn-more-about-premium-button',
}

export enum UpgradePromptTestIds {
  BoardLimitUpgradeTile = 'board-limit-upgrade-tile',
  CardBackUpgradePill = 'card-back-upgrade-pill',
  CollectionsUpgradePrompt = 'collections-upgrade-prompt',
  CollectionsUpgradePill = 'collections-upgrade-pill',
  CreateBoardUpgradePrompt = 'create-board-upgrade-prompt',
  InviteUpgradePrompt = 'invite-upgrade-prompt',
  PlanSelection = 'plan-selection',
  PrintAndExportUpgradePrompt = 'print-and-export-upgrade-prompt',
  PrintAndExportUpgradePill = 'print-and-export-upgrade-pill',
  PuPsUpgradePill = 'card-back-pups-upgrade-pill',
  PuPsUpgradePrompt = 'pups-upgrade-prompt',
  OrgMemberRestrictedPermission = 'org-member-restricted-permission',
  TeamBoardsHeaderUpgradeButton = 'team-boards-header-upgrade-button',
  TeamHomeSidebarUpgradePrompt = 'team-home-sidebar-upgrade-prompt',
  TeamBoardsPageUpgradePrompt = 'team-boards-page-upgrade-prompt',
  TeamMembersPageUpgradePrompt = 'team-members-page-upgrade-prompt',
  TeamlessUpgradePrompt = 'teamless-upgrade-prompt',
  TeamPermissionsUpgradePrompt = 'team-permissions-upgrade-prompt',
  TemplatesUpgradePill = 'templates-upgrade-pill',
}

export enum ChecklistTestIds {
  ChecklistItemCheckbox = 'checklist-item-checkbox',
  ChecklistItemConvertButton = 'checklist-item-convert-button',
  ChecklistItemDeleteButton = 'checklist-item-delete-button',
  ChecklistItemEditDueButton = 'checklist-item-edit-due-button',
  ChecklistItemEditMemberButton = 'checklist-item-edit-member-button',
  ChecklistItemAssignedBadge = 'checklist-item-assigned-badge',
  ChecklistItemOverflowMenuButton = 'checklist-item-overflow-menu-button',
  ChecklistItemRemoveDateButton = 'checklist-item-remove-date-button',
  ChecklistItemAddMemberButton = 'checklist-item-add-member-button',
  ChecklistItemRemoveMemberButton = 'checklist-item-remove-member-button',
  ChecklistItemSetDueButton = 'checklist-item-set-due-button',
  ChecklistItemSetMemberButton = 'checklist-item-set-member-button',
  YourItemsChecklistItemContainer = 'your-items-checklist-item-container',
  YourItemsCheckboxChecked = 'your-items-checkbox-checked',
  YourItemsCheckboxUnchecked = 'your-items-checkbox-unchecked',
  YourItemsShowMore = 'your-items-show-more',
}

export enum ProfileTestIds {
  ProfileAvatar = 'profile-avatar',
  ProfileTabContainer = 'profile-tab-container',
}

export enum PluginHeaderButtonTestIds {
  HeaderButton = 'board-header-plugin-button',
  HeaderPluginLength = 'board-header-plugin-button-length',
  SettingsButton = 'settings-button',
  ExploreButton = 'explore-button',
}

export enum WorkSpacesPreambleTestIds {
  WorkspacesPreambleCreateTeamButton = 'workspaces-preamble-create-team-button',
  WorkspacesPreambleSelectTeamType = 'workspaces-preamble-select-team-type',
  WorkspacesPreambleCreateTeamSubmit = 'workspaces-preamble-create-team-submit',
  WorkspacesTeamTypeOtherOption = 'workspaces-preamble-select-team-type-other',
  WorkspacesPreambleSpinner = 'workspaces-preamble-spinner',
}

export enum BCTeamOnboardingTestIds {
  BCTeamOnboardingInviteMemberButton = 'bc-team-onboarding-invite-member-button',
  BCTeamOnboardingCheckItem1 = 'bc-team-onboarding-checkitem-1',
  BCTeamOnboardingCheckItem2 = 'bc-team-onboarding-checkitem-2',
  BCTeamOnboardingCheckItem3 = 'bc-team-onboarding-checkitem-3',
  BCTeamOnboardingCheckItem4 = 'bc-team-onboarding-checkitem-4',
  BCTeamOnboardingCheckItem5 = 'bc-team-onboarding-checkitem-5',
  BCTeamOnboardingCheckItem6 = 'bc-team-onboarding-checkitem-6',
}

export enum FreeTeamOnboardingTestIds {
  FreeTeamOnboardingCheckItem1 = 'free-team-onboarding-checkitem-1',
  FreeTeamOnboardingCheckItem2 = 'free-team-onboarding-checkitem-2',
  FreeTeamOnboardingCheckItem3 = 'free-team-onboarding-checkitem-3',
  FreeTeamOnboardingCheckItem4 = 'free-team-onboarding-checkitem-4',
  FreeTeamOnboardingCheckItem5 = 'free-team-onboarding-checkitem-5',
}

export enum BoardReportsViewTestIds {
  CardsPerListBarChart = 'cards-per-list-bar-chart',
  CardsPerListEmptyState = 'cards-per-list-empty-state',
  CardsPerDueDateBarChart = 'cards-per-due-date-bar-chart',
  CardsPerDueDateEmptyState = 'cards-per-due-date-empty-state',
  CardsPerLabelBarChart = 'cards-per-due-date-bar-chart',
  CardsPerLabelEmptyState = 'cards-per-label-empty-state',
  DashboardWrapper = 'dashboard-wrapper',
  CloseButton = 'close-button',
}

export enum TableTestIds {
  TeamBoardSelectInput = 'team-board-select-input',
  TeamBoardSelectAddBoardsButton = 'team-board-select-add-boards-button',
  TeamBoardTile = 'team-board-tile',
  RemoveBoardButton = 'remove-board-button',
  TableBody = 'table-body',
  QuickFiltersButton = 'quick-filters-button',
  QuickFilterAllCardsOption = 'quick-filter-all-cards-option',
  CustomizeViewButton = 'customize-view-button',
}

export enum TableTestClasses {
  TableRow = 'table-row',
  LabelBadge = 'label-badge',
  RedLabelBadge = 'red-label-badge',
  MemberCell = 'member-cell',
  MemberAvatar = 'member-avatar',
  DueDateCheckboxChecked = 'due-date-checkbox-checked',
  DueDateCheckboxUnchecked = 'due-date-checkbox-unchecked',
  HeaderCellFilterActive = 'header-cell-filter-active',
}

export enum CalendarViewTestIds {
  CalendarEvent = 'calendar-event',
  ACItemCheckbox = 'advanced-checklist-checkbox',
  CalendarWrapper = 'calendar-wrapper',
  BackgroundCellWrapper = 'background-cell-wrapper',
  ShowMoreButton = 'show-more-button',
  CurrentTimeLine = 'current-time-line',
  CurrentTimeDot = 'current-time-dot',
}

export enum TimelineTestIds {
  TimelineWrapper = 'timeline-wrapper',
  TimelineAddCard = 'timeline-add-card',
}

export enum ViewHeaderTestIds {
  PreviousButton = 'previous-button',
  NextButton = 'next-button',
  TodayButton = 'today-button',
  CloseButton = 'close-button',
  SettingsButton = 'settings-button',
}

export enum WorkspaceSwitcherTestIds {
  WorkspaceSwitcher = 'workspace-switcher',
  WorkspaceSwitcherPopover = 'workspace-switcher-popover',
  CreateTeamPlusButton = 'create-team-plus-button',
  CreateTeamFullButton = 'create-team-full-button',
  PersonalWorkspaceListItem = 'personal-workspace-list-item',
  WorkspaceList = 'workspace-list',
  CurrentWorkspaceListSectionHeader = 'current-workspaces-list-section-header',
  MemberWorkspacesListSectionHeader = 'member-workspaces-list-section-header',
  GuestWorkspacesListSectionHeader = 'guest-workspaces-list-section-header',
}

export enum RecentlyViewedBoardsMenuTestIds {
  RecentlyViewedBoardsMenuPopOver = 'recently-viewed-boards-menu-popover',
  RecentlyViewedBoardsMenu = 'recently-viewed-boards-menu',
}

export enum WorkspaceNavigationTestIds {
  WorkspaceDetail = 'workspace-detail',
  WorkspaceBoardsAndViewsLists = 'workspace-boards-and-views-lists',
  AllBoardsList = 'all-boards-list',
  CreateWorkspaceViewButton = 'create-workspace-view-button',
  CurrentWorkspaceExpanded = 'current-workspace-expanded',
  CurrentWorkspaceLoadingSpinner = 'current-workspace-loading-spinner',
  WorkspaceNavigationLoadingSpinner = 'workspace-navigation-loading-spinner',
  WorkspaceListExpanded = 'workspace-list-expanded',
  WorkspaceNavigationCollapseButton = 'workspace-navigation-collapse-button',
  WorkspaceNavigationExpandButton = 'workspace-navigation-expand-button',
  CollapsibleList = 'collapsible-list',
  CollapsibleListItems = 'collapsible-list-items',
  ViewsList = 'views-list',
  BoardTemplateBadge = 'board-template-badge',
  BoardRecentActivityIndicator = 'board-recent-activity-indicator',
  SeeAllTeamBoardsLink = 'see-all-team-boards-link',
  ViewsListItem = 'workspace-nav-views-list-item',
  BetaPill = 'workspace-nav-beta-pill',
  BoardsListEmptyState = 'boards-list-empty-state',
  TeamsListEmptyState = 'teams-list-empty-state',
  StarredListEmptyState = 'starred-list-empty-state',
  WorkspaceNavigation = 'workspace-navigation',
  WorkspaceNavigationCollapsedContainer = 'workspace-navigation-collapsed-container',
  WorkspaceNavigationExpandedContainer = 'workspace-navigation-expanded-container',
  WorkspaceNavigationCollapsed = 'workspace-navigation-collapsed',
  WorkspaceNavigationExpanded = 'workspace-navigation-expanded',
  WorkspaceNavigationCollapsedSpinner = 'workspace-navigation-collapsed-spinner',
  WorkspaceNavigationExpandedSpinner = 'workspace-navigation-expanded-spinner',
  WorkspaceNavigationExpandedError = 'workspace-navigation-expanded-error',
  WorkspaceNavigationNav = 'workspace-navigation-nav',
  CreateTeamButton = 'create-team-button',
  CreateTeamPlusButton = 'create-team-plus-button',
  CreateTeamFullButton = 'create-team-full-button',
  PopoverInviteMembersButton = 'popover-invite-members-button',
  PopoverViewMembersButton = 'popover-view-members-button',
  PopoverSettingsButton = 'popover-settings-button',
  GuestWorkspaceDisclaimer = 'guest-workspace-disclaimer',
  BoardsListShowMoreButton = 'boards-list-show-more-button',
}

export enum MigrationWizardTestIds {
  StartButton = 'mw-start-button',
  Wizard = 'mw-modal',
  IntroStartButton = 'mw-intro-start-button',
  TeamNameInput = 'mw-team-name-input',
  SelectOtherTeamButton = 'mw-select-other-team-button',
  SelectAllButton = 'mw-select-all-button',
  BoardTile = 'mw-board-tile',
  CreateBoardsNextButton = 'mw-create-boards-next-button',
  ErrorPill = 'mw-error-pill',
  MoveBoardsButton = 'mw-move-boards-button',
  TeamMembershipsNextButton = 'mw-team-memberships-next-button',
  BoardVisibilityNextButton = 'mw-board-visibility-next-button',
  PreMigrationBanner = 'mw-pre-migration-banner',
  BoardVisibilityItem = 'mw-board-visibility-item',
  WorkspaceChooserButton = 'mw-workspace-chooser-button',
  WorkspaceOption = 'mw-workspace-option',
  DismissButton = 'mw-dismiss-button',
  DoneComponentDoneButton = 'mw-done-button',
}

export enum DateRangePickerTestIds {
  CardBackDueDateButton = 'card-back-due-date-button',
  StartDateBadgeWithDateRangePicker = 'start-date-badge-with-date-range-picker',
  DueDateBadgeWithDateRangePicker = 'due-date-badge-with-date-range-picker',
  StartDateField = 'start-date-field',
  DueDateField = 'due-date-field',
  DueTimeField = 'due-time-field',
  ToggleStartDateButton = 'toggle-start-date-button',
  DueReminderSelect = 'due-reminder-select',
  SaveDateButton = 'save-date-button',
  RemoveDateButton = 'remove-date-button',
  DatePickerForm = 'date-picker-form',
}

export enum CardTemplateTestIds {
  CardTemplateListButton = 'card-template-list-button',
  CreateNewTemplateCardButton = 'create-new-template-card-button',
  CreateTemplateCardComposer = 'create-template-card-composer',
  NewTemplateCardSubmitButton = 'new-template-card-submit-button',
  TemplateCardBackBanner = 'template-card-back-banner',
  CreateCardFromTemplateBannerButton = 'create-card-from-template-banner-button',
  CreateCardFromTemplateButton = 'create-card-from-template-button',
  CardTitleTextarea = 'card-title-textarea',
}

export enum TemplatesTestIds {
  TemplatesContainer = 'templates-container',
}

export enum ShortcutsPageTestIds {
  ShortcutsContainer = 'shortcuts-container',
}

export enum ViewSuggestionTestIds {
  CalendarSuggestionUpsell = 'calendar-suggestion-upsell',
  TimelineSuggestionUpsell = 'timeline-suggestion-upsell',
}

export type TestId =
  | BillingIds
  | OrganizationViewTestIds
  | BoardTileTestIds
  | CreateBoardTestIds
  | CreateFirstBoardIds
  | HeaderTestIds
  | HomeTestIds
  | NavigationTestIds
  | NotificationTestIds
  | PopoverTestIds
  | PowerUpTestIds
  | PurchaseFormIds
  | TeamTestIds
  | MoonshotTestIds
  | SlackCodesTestIds
  | CardBackTestIds
  | BoardHeaderTestIds
  | EnterpriseDashboardTestIds
  | SelectTestIds
  | FreeTrialTestIds
  | ChecklistTestIds
  | ProfileTestIds
  | WorkSpacesPreambleTestIds
  | BCTeamOnboardingTestIds
  | UpgradePromptTestIds
  | FreeTeamOnboardingTestIds
  | TableTestIds
  | CalendarViewTestIds
  | TimelineTestIds
  | WorkspaceNavigationTestIds
  | WorkspaceSwitcherTestIds
  | RecentlyViewedBoardsMenuTestIds
  | MigrationWizardTestIds
  | DateRangePickerTestIds
  | CardTemplateTestIds
  | TemplatesTestIds
  | ShortcutsPageTestIds
  | ViewSuggestionTestIds;

export type TestClass = TeamTestClasses | TableTestClasses | SelectTestClasses;
