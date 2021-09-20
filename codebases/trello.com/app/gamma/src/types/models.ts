/* eslint-disable @trello/disallow-filenames */
import { BaseEmoji } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { ActionDisplayType } from 'app/src/components/ActionEntities';
import { OrganizationLimits, NonPublicFields } from './responses';
import { TeamTypes } from '@trello/organizations';
import { EnterpriseLicenseType } from '@trello/enterprise';

export interface CampaignModel {
  id: string;
  name: string;
  dateDismissed: Date | null;
  currentStep: string | null;
}

export interface CommentDataModel {
  board?: BoardModel;
  card?: CardModel;
  list?: ListModel;
  text?: string;
  textData?: object;
}

export interface CommentModel {
  text?: string;
}

export interface AppCreatorModel {
  name?: string;
  id?: string;
  idPlugin?: string;
  iconClass?: string;
  urlSuffix?: string;
}

export interface ButlerRuleDataModel {
  id: string;
  text: string;
  url: string;
}

export interface ActionDataModel {
  actionType?: string;
  board?: BoardModel;
  card?: CardModel;
  cardSource?: object; // TODO create this type
  checklist?: ChecklistModel;
  checklistItem?: ChecklistItemModel;
  idExport?: string;
  list?: ListModel;
  listAfter?: ListModel;
  listBefore?: ListModel;
  name?: string;
  plugin?: object; // TODO create this type
  rule?: ButlerRuleDataModel;
  team?: TeamModel;
  text?: string;
}

export interface ActionDisplayModel {
  entities?: DisplayEntitiesModel;
  translationKey?: string;
}

export interface DisplayEntitiesModel {
  attachment?: AttachmentModel;
  attachmentPreview?: AttachmentPreviewModel;
  contextOn?: TranslatableEntityModel;
  comment?: CommentModel;
  level?: TranslatableEntityModel;
  memberCreator?: MemberModel;
  memberInviter?: MemberModel;
  team?: TeamModel;
}

export interface TranslatableEntityModel {
  hideIfContext?: boolean;
  idContext?: string;
  translationKey?: string;
  type: 'translatable';
}

export interface ActionModel {
  board?: BoardModel;
  card?: CardModel;
  data?: ActionDataModel;
  date?: Date;
  display?: ActionDisplayType;
  id: string;
  idBoard?: string;
  idCard?: string;
  idMemberCreator?: string;
  list?: ListModel;
  member?: MemberModel;
  memberCreator?: MemberModel;
  memberInviter?: MemberModel;
  type?: string;
}

export interface AttachmentModel {
  date: Date;
  id: string;
  isUpload: boolean;
  mimeType: string;
  name: string;
  previews: AttachmentPreviewModel[];
  url: string;
}

export interface AttachmentPreviewModel {
  id: string;
  bytes: number;
  height: number;
  scaled: boolean;
  url: string;
  width: number;
}

export interface BadgesModel {
  attachments: number;
  attachmentsByType: {
    trello: {
      board: number;
      card: number;
    };
  };
  checklistItems: number;
  checklistItemsChecked: number;
  comments: number;
  description: boolean;
  due: Date | null;
  dueComplete: boolean;
  start: Date | null;
  subscribed: boolean;
  viewingMemberVoted: boolean;
  votes: number;
  checkItemsEarliestDue: Date | null;
}

export interface BoardBackgroundModel {
  bottomColor: string | null;
  brightness: 'dark' | 'light';
  color: string | null;
  tile: boolean;
  url: string | null;
  scaled: ImagePreviewModel[];
}

export enum BoardCreationMethod {
  Demo = 'demo',
  Automatic = 'automatic',
  Assisted = 'assisted',
}

export interface BoardModel {
  background?: BoardBackgroundModel;
  closed?: boolean;
  creationMethod?: BoardCreationMethod | null;
  dateLastActivity?: Date;
  dateLastView?: Date;
  id: string;
  idTeam?: string | null;
  isStarred?: boolean;
  enterpriseOwned?: boolean;
  memberships?: MembershipModel[];
  name?: string;
  prefs?: BoardPreferencesModel;
  premiumFeatures?: string[];
  shortLink?: string;
  url?: string;
}

export interface BoardPreferencesModel {
  cardCovers: boolean;
  comments: string;
  permissionLevel: BoardPermissionLevel;
  isTemplate: boolean;
}

export type BoardPermissionLevel =
  | AccessLevel.Enterprise
  | AccessLevel.Private
  | AccessLevel.Public
  | AccessLevel.Org;

export interface BoardStarModel {
  deleted?: boolean;
  id: string;
  idBoard: string;
  pos: number;
}

export interface BoardsMenuSelectedItemModel {
  id: string;
  category: string | null;
  url: string | undefined;
}

export interface ReopenBoardPopoverModel {
  idBoard: string;
  newBillableGuests: MemberModel[];
  availableLicenseCount: number;
  adminNames: string[];
}

export enum CardRole {
  Separator = 'separator',
  Board = 'board',
  Mirror = 'mirror',
  Link = 'link',
}

export interface CardModel {
  badges?: BadgesModel;
  closed?: boolean;
  cover?: CoverPhotoModel | null;
  desc?: string;
  due?: Date;
  dueComplete?: boolean;
  id: string;
  attachments?: AttachmentModel[];
  idBoard?: string;
  idChecklists?: string[];
  idLabels?: string[];
  idList?: string;
  idMembers?: string[];
  idShort?: number;
  isTemplate?: boolean;
  list?: ListModel;
  name?: string;
  pos?: number;
  url?: string;
  shortLink?: string;
  start?: Date;
  stickers?: StickerModel[];
  cardRole?: CardRole | null;
}

export enum BoardsMenuCategoryType {
  Starred = 'starred-boards',
  Recent = 'recent-boards',
  Personal = 'my-boards',
  Team = 'org',
}

export interface BoardsMenuCategoryModel {
  readonly boards: BoardModel[];
  readonly category: string;
  readonly type: BoardsMenuCategoryType;
  readonly id: string;
  readonly teamShortName?: string;
  readonly teamId?: string;
  readonly numLessActiveBoards?: number;
  readonly logos?: { [size: string]: string } | null;
  readonly isPremiumTeam?: boolean;
  readonly isStandardTeam?: boolean;
  readonly hasViewsFeature?: boolean;
  readonly url?: string;
}

export type BoardVisibilityRestrict =
  | AccessLevel.Admin
  | AccessLevel.Org
  | AccessLevel.None;

export interface ChannelModel {
  name: string;
  displayName: string;
  active: boolean;
}

export interface ChecklistModel {
  id: string;
  idBoard: string;
  idCard: string;
  checkItems: ChecklistItemModel[];
  name: string;
  pos: number;
}

export interface ChecklistItemModel {
  checked: boolean;
  id: string;
  name: string;
  nameData: object; // TODO: figure out what this is
  pos: number;
}

export enum CoverColor {
  Blue = 'blue',
  Green = 'green',
  Orange = 'orange',
  Purple = 'purple',
  Red = 'red',
  Yellow = 'yellow',
  Pink = 'pink',
  Sky = 'sky',
  Lime = 'lime',
  Black = 'black',
}

export interface CoverPhotoModel {
  url?: string;
  edgeColor?: string | null;
  previews?: ImagePreviewModel[];
  sharedSourceUrl?: string;
  color?: CoverColor | null;
  size?: 'normal' | 'full';
  brightness?: 'light' | 'dark';
}

export interface ImagePreviewModel {
  scaled: boolean;
  height: number;
  url: string;
  width: number;
}

export interface LabelModel {
  color: LabelColor | null;
  id: string;
  idBoard: string;
  name: string;
}

export enum LabelColor {
  Black = 'black',
  Blue = 'blue',
  Green = 'green',
  Lime = 'lime',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple',
  Red = 'red',
  Sky = 'sky',
  Yellow = 'yellow',
}

export interface ListModel {
  closed: boolean;
  id: string;
  idBoard: string;
  name: string;
  pos: number;
  subscribed?: boolean;
}

export interface LoginModel {
  email: string;
  id: string;
  primary: boolean;
}

export interface EnterpriseModel {
  displayName: string;
  id: string;
  name: string;
  logoHash?: string;
  logoUrl?: string;
  organizationPrefs?: TeamPreferencesModel;
  isAtlassianOrg?: boolean;
  atlOrgId?: string;
}

export type PrivacyModel = { [key in NonPublicFields]?: string | null };

export interface MemberMessagesDismissedModel {
  _id: string;
  count: number;
  lastDismissed: string;
  name: string;
}

export type MemberType = AccessLevel.Ghost | AccessLevel.Normal;

export interface MemberEnterpriseLicense {
  idEnterprise: string;
  type: EnterpriseLicenseType;
}

export enum AvatarSources {
  atlassianAccount = 'atlassianAccount',
  gravatar = 'gravatar',
  upload = 'upload',
  none = 'none',
}
export interface MemberModel {
  aaEmail?: string | null;
  aaEnrolledDate?: string | null;
  aaId?: string | null;
  aaBlockSyncUntil?: string | null;
  activityBlocked?: boolean;
  avatars?: { [size: string]: string } | null;
  avatarSource?: AvatarSources;
  bio?: string;
  campaigns?: CampaignModel[] | null;
  channels?: Channels | null;
  credentialsRemovedCount?: string | null;
  confirmed?: boolean;
  domainClaimed?: string | null;
  email?: string | null;
  enterpriseLicenses?: MemberEnterpriseLicense[];
  enterprises: EnterpriseModel[];
  id: string;
  idBoards?: string[];
  idEnterprise?: string | null;
  idEnterprisesAdmin?: string[];
  idOrganizations?: string[];
  idPremOrgsAdmin: string[];
  initials?: string;
  isAaMastered?: boolean;
  logins?: LoginModel[];
  loginTypes?: string[] | null;
  marketingOptIn?: MarketingOptInModel;
  memberType?: MemberType;
  messagesDismissed?: MemberMessagesDismissedModel[] | null;
  name?: string;
  nonPublic?: PrivacyModel;
  oneTimeMessagesDismissed?: string[] | null;
  paidAccount?: PaidAccount | null;
  prefs?: MemberPreferencesModel;
  products?: number[];
  savedSearches?: SavedSearchModel[];
  sessions?: SessionModel[];
  tokens?: TokenModel[];
  username?: string;
}

export interface Channels {
  active: string;
  allowed: string[];
  dev: boolean;
}

export enum NotificationEmailFrequency {
  Never = -1,
  Periodically = 60,
  Instantly = 1,
}

export interface MemberPreferencesModel {
  colorBlind: boolean;
  locale: string;
  minutesBeforeDeadlineToNotify: number;
  minutesBetweenSummaries: NotificationEmailFrequency;
  sendSummaries: boolean;
  timezoneInfo: {
    dateNext: string;
    offsetCurrent: number;
    offsetNext: number;
    timezoneCurrent: string;
    timezoneNext: string;
  };
  twoFactor: {
    enabled: boolean;
    needsNewBackups: boolean;
  };
}

export type MarketingOptInModel =
  | object
  | {
      date: Date;
      optedIn: boolean;
    };

export enum AccessLevel {
  Admin = 'admin',
  Enterprise = 'enterprise',
  Normal = 'normal',
  Public = 'public',
  Private = 'private',
  Org = 'org',
  Observer = 'observer',
  Virtual = 'virtual',
  Ghost = 'ghost',
  Deactivated = 'deactivated',
  Unconfirmed = 'unconfirmed',
  None = 'none',
}

export type MembershipType =
  | AccessLevel.Admin
  | AccessLevel.Normal
  | AccessLevel.Observer;

export interface MembershipModel {
  id: string;
  deactivated: boolean;
  idMember: string;
  type: MembershipType;
  unconfirmed: boolean;
}

export interface NotificationDataBoardModel {
  id: string;
  name: string;
  shortLink: string;
  url: string;
}

export interface NotificationDataCardModel {
  closed: boolean;
  due: string;
  id: string;
  idList: string;
  idShort: number;
  name: string;
  shortLink: string;
  url: string;
}

export interface NotificationDataListModel {
  id: string;
  name: string;
}

export interface NotificationDataMemberModel {
  avatarUrl: string;
  fullName: string;
  id: string;
  initials: string;
  username: string;
}

export interface NotificationModel {
  appCreator?: AppCreatorModel | null;
  data?: ActionDataModel;
  date?: Date;
  display: ActionDisplayType;
  id: string;
  idAction?: string;
  idMemberCreator?: string;
  memberCreator?: MemberModel;
  type?: string;
  unread?: boolean;
  dateRead?: string | null;
  isReactable?: boolean;
}

export interface NotificationGroupModel {
  id: string;
  idGroup: string;
  notifications: NotificationModel[];
  card?: CardModel;
  board?: BoardModel;
}

export interface NotificationsCountModel {
  [typeAndId: string]: number;
}

export interface ReactionModel {
  id: string;
  idEmoji: string;
  idMember: string;
  idModel: string;
  emoji: BaseEmoji;
  member: MemberModel;
}

export interface ReactorName {
  id: string;
  name: string;
}

export type ReactorsNames = ReactorName[];

export interface SavedSearchModel {
  id: string;
  name: string;
  pos: number;
  query: string;
}

export interface SearchResultsModel {
  cardsPage: number;
  hasMoreCards: boolean;
  noMatchesFound: boolean;
  idBoards: string[];
  idCards: string[];
  idMembers: string[];
  idTeams: string[];
  totalCards: string[];
}

export enum SearchSuggestionType {
  IsArchived = 'is:archived',
  IsOpen = 'is:open',
  IsStarred = 'is:starred',
  HasAttachments = 'has:attachments',
  HasCover = 'has:cover',
  HasDescription = 'has:description',
  HasStickers = 'has:stickers',
  HasMembers = 'has:members',
  At = '@',
  Me = '@me',
  Member = 'member:',
  Label = 'label:',
  Hash = '#',
  Board = 'board:',
  List = 'list:',
  Name = 'name:',
  Comment = 'comment:',
  Checklist = 'checklist:',
  Description = 'description:',
  DueDay = 'due:day',
  DueWeek = 'due:week',
  DueMonth = 'due:month',
  Overdue = 'due:overdue',
  Incomplete = 'due:incomplete',
  Complete = 'due:complete',
  CreatedDay = 'created:day',
  CreatedWeek = 'created:week',
  CreatedMonth = 'created:month',
  EditedDay = 'edited:day',
  EditedWeek = 'edited:week',
  EditedMonth = 'edited:month',
  SortCreated = 'sort:created',
  SortEdited = 'sort:edited',
  SortDue = 'sort:due',
}

export interface SearchSuggestionsResultsModel {
  keywords: SearchSuggestionType[];
  idMembers: string[];
  idBoards: string[];
}

export interface SessionModel {
  dateLastUsed: Date;
  id: string;
  ipAddress: string;
  isCurrent: boolean;
}

export interface StickerModel {
  id: string;
  image: string;
  imageUrl: string;
  imageUrl2x: string | null;
  left: number;
  top: number;
  rotate: number;
  zIndex: number;
}

export interface TeamModel {
  id: string;
  idEnterprise?: string | null;
  desc?: string;
  descData?: object;
  displayName: string;
  logos?: { [size: string]: string } | null;
  limits?: OrganizationLimits;
  memberships?: MembershipModel[];
  name: string;
  prefs?: TeamPreferencesModel;
  premiumFeatures?: string[];
  products?: number[];
  standardVariation?: string | null;
  teamType?: TeamTypes;
  text?: string;
  type?: string;
  url: string;
  website?: string;
}

export interface TeamPreferencesModel {
  permissionLevel: string;
  boardInviteRestrict: string;
  orgInviteRestrict: string[];
  associatedDomain: string;
  googleAppsVersion: number;
  boardVisibilityRestrict: { [key: string]: string };
}

export interface TokenModel {
  id: string;
  identifier: string;
  permissions: TokenPermissionModel[];
  dateCreated: Date;
  dateExpires: Date | null;
}

export interface TokenPermissionModel {
  modelType: string;
  read: boolean;
  write: boolean;
  idModel: string;
}

// Copied from schema.graphqls
export interface PaidAccount {
  products: number[];
  invoiceDetails?: string;
  expirationDates: object;
  billingDates: object;
  dateFirstSubscription: string;
  contactLocale: string;
  contactEmail: string;
  contactFullName: string;
  cardLast4: string;
  cardType: string;
  standing: number;
  ixSubscriber: number;
  zip?: string;
  country?: string;
  taxId?: string;
}
