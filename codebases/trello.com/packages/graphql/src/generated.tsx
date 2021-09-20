import { JSONString, FileUpload, FileUploadProgressCallback, ButlerCommand } from './customScalarTypes';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * An object that represents a parsed Butler command. Typing this in the schema would be very
   * expensive. Currently supported commands are typed in the butler-command-parser package,
   * but this list is not extensive. Cannot trivially use JSONString scalar because the alternative
   * type of a Butler command is a string, so passing it around as an object makes refining its type
   * dramatically easier.
   */
  ButlerCommand: ButlerCommand;
  /** An alias for the File type. Should be used for any mutation where we are uploading a file. */
  FileUpload: FileUpload;
  /**
   * A callback function that takes in a number and does not return anything. Should be used if
   * we have a resolver that uploads a file and its progress needs to be tracked.
   */
  FileUploadProgressCallback: FileUploadProgressCallback;
  /**
   * An object which contains unknown (user generated) keys and values serialized to a string.
   * Should only be used in scenarios where we cannot provide stricter typing, for example, the
   * custom emoji data required to render Trello Markdown. The consuming component is responsible
   * for parsing the string into JSON.
   * See https://github.com/apollographql/apollo-feature-requests/issues/2 for discussion
   */
  JSONString: JSONString;
};


/**
 * Actions are generated whenever an action occurs in Trello. For instance, when a user deletes a card, a
 * `deleteCard` action is generated and includes information about the deleted card.
 */
export type Action = {
  __typename: 'Action';
  /** The ID of the Action */
  id: Scalars['ID'];
  /** The type of the Action */
  type: Action_Type;
  /** When the Action occurred */
  date: Scalars['String'];
  /** Relevant information regarding the Action */
  data: Scalars['JSONString'];
  /** The ID of the Member who caused the Action */
  idMemberCreator: Scalars['String'];
  /** Relevant information for displaying the Action */
  display: Action_Display;
  /** The Member who caused the Action */
  memberCreator: Member;
  /** The Reactions on the Action */
  reactions: Array<Reaction>;
};

/** Relevant information for displaying the Action */
export type Action_Display = {
  __typename: 'Action_Display';
  /** The key used to translate the Action */
  translationKey?: Maybe<Scalars['String']>;
  /** Information about any Entities involved in the Action */
  entities: Scalars['JSONString'];
};

/** The Types of Actions */
export const Action_Type = {
  AcceptEnterpriseJoinRequest: 'acceptEnterpriseJoinRequest',
  AddAdminToEnterprise: 'addAdminToEnterprise',
  AddAttachmentToCard: 'addAttachmentToCard',
  AddChecklistToCard: 'addChecklistToCard',
  AddMemberToBoard: 'addMemberToBoard',
  AddMemberToCard: 'addMemberToCard',
  AddMemberToOrganization: 'addMemberToOrganization',
  AddOrganizationToEnterprise: 'addOrganizationToEnterprise',
  AddToEnterprisePluginWhitelist: 'addToEnterprisePluginWhitelist',
  AddToOrganizationBoard: 'addToOrganizationBoard',
  ChangeEnterprisePublicBoardVisibility: 'changeEnterprisePublicBoardVisibility',
  CommentCard: 'commentCard',
  ConvertToCardFromCheckItem: 'convertToCardFromCheckItem',
  CopyBoard: 'copyBoard',
  CopyCard: 'copyCard',
  CopyCommentCard: 'copyCommentCard',
  CreateBoard: 'createBoard',
  CreateCard: 'createCard',
  CreateCustomField: 'createCustomField',
  CreateEnterpriseJoinRequest: 'createEnterpriseJoinRequest',
  CreateList: 'createList',
  CreateOrganization: 'createOrganization',
  DeactivatedMemberInEnterprise: 'deactivatedMemberInEnterprise',
  DeactivatedMemberInOrganization: 'deactivatedMemberInOrganization',
  DeclineEnterpriseJoinRequest: 'declineEnterpriseJoinRequest',
  DeleteAttachmentFromCard: 'deleteAttachmentFromCard',
  DeleteBoardInvitation: 'deleteBoardInvitation',
  DeleteCard: 'deleteCard',
  DeleteCustomField: 'deleteCustomField',
  DeleteOrganizationInvitation: 'deleteOrganizationInvitation',
  DisableEnterprisePluginWhitelist: 'disableEnterprisePluginWhitelist',
  DisableIssuingOfConsentTokensInEnterprise: 'disableIssuingOfConsentTokensInEnterprise',
  DisablePlugin: 'disablePlugin',
  DisablePowerUp: 'disablePowerUp',
  EmailCard: 'emailCard',
  EnableEnterprisePluginWhitelist: 'enableEnterprisePluginWhitelist',
  EnableIssuingOfConsentTokensInEnterprise: 'enableIssuingOfConsentTokensInEnterprise',
  EnablePlugin: 'enablePlugin',
  EnablePowerUp: 'enablePowerUp',
  EnterpriseAdminViewedPrivateBoard: 'enterpriseAdminViewedPrivateBoard',
  MakeAdminOfBoard: 'makeAdminOfBoard',
  MakeNormalMemberOfBoard: 'makeNormalMemberOfBoard',
  MakeNormalMemberOfOrganization: 'makeNormalMemberOfOrganization',
  MakeObserverOfBoard: 'makeObserverOfBoard',
  MemberJoinedTrello: 'memberJoinedTrello',
  MoveCardFromBoard: 'moveCardFromBoard',
  MoveCardToBoard: 'moveCardToBoard',
  MoveListFromBoard: 'moveListFromBoard',
  MoveListToBoard: 'moveListToBoard',
  ReactivatedMemberInEnterprise: 'reactivatedMemberInEnterprise',
  ReactivatedMemberInOrganization: 'reactivatedMemberInOrganization',
  RemoveAdminFromEnterprise: 'removeAdminFromEnterprise',
  RemoveChecklistFromCard: 'removeChecklistFromCard',
  RemovedAllTokensFromOwnedMembers: 'removedAllTokensFromOwnedMembers',
  RemovedTokensFromMember: 'removedTokensFromMember',
  RemoveFromEnterprisePluginWhitelist: 'removeFromEnterprisePluginWhitelist',
  RemoveFromOrganizationBoard: 'removeFromOrganizationBoard',
  RemoveMemberFromCard: 'removeMemberFromCard',
  RemoveOrganizationFromEnterprise: 'removeOrganizationFromEnterprise',
  TrelloAddAdminToEnterprise: 'trelloAddAdminToEnterprise',
  TrelloAddOrganizationToEnterprise: 'trelloAddOrganizationToEnterprise',
  TrelloRemoveAdminFromEnterprise: 'trelloRemoveAdminFromEnterprise',
  TrelloRemoveOrganizationFromEnterprise: 'trelloRemoveOrganizationFromEnterprise',
  UnconfirmedBoardInvitation: 'unconfirmedBoardInvitation',
  UnconfirmedOrganizationInvitation: 'unconfirmedOrganizationInvitation',
  UpdateBoard: 'updateBoard',
  UpdateBoardOrg: 'updateBoardOrg',
  UpdateBoardVisibility: 'updateBoardVisibility',
  UpdateCard: 'updateCard',
  UpdateCheckItemStateOnCard: 'updateCheckItemStateOnCard',
  UpdateChecklist: 'updateChecklist',
  UpdateEnterprise: 'updateEnterprise',
  UpdateCustomField: 'updateCustomField',
  UpdateCustomFieldItem: 'updateCustomFieldItem',
  UpdateList: 'updateList',
  UpdateMember: 'updateMember',
  UpdateOrganization: 'updateOrganization',
  WithdrawEnterpriseJoinRequest: 'withdrawEnterpriseJoinRequest'
} as const;

export type Action_Type = typeof Action_Type[keyof typeof Action_Type];
/** Price quotes for additional members */
export type AddMembersPriceQuotes = {
  __typename: 'AddMembersPriceQuotes';
  /** The price quote for the remainder of the current subscription period */
  prorated: PriceQuote;
  /** The price quote for the next renewal */
  renewal: PriceQuote;
};

/** Announcements appear in the header in the Taco component */
export type Announcement = {
  __typename: 'Announcement';
  /** The ID of the Announcement */
  id: Scalars['ID'];
  /** The title of the Announcement */
  title: Scalars['String'];
  /** The HTML content of the Announcement */
  html: Scalars['String'];
  /** The locale of the Announcement */
  locale: Scalars['String'];
  /** The type of Announcement */
  type: AnnouncementType;
  /** The url to learn more about the Announcement */
  url?: Maybe<Scalars['String']>;
};

/**
 * The types of Announcements. Most are blog posts, but there is a reserved type for announcing
 * maintenance downtime that will give the Roo component an alternate appearance
 */
export const AnnouncementType = {
  Blog: 'blog',
  Downtime: 'downtime'
} as const;

export type AnnouncementType = typeof AnnouncementType[keyof typeof AnnouncementType];
/** The response when dismissing an announcement. Just indicates success */
export type Announcement_DismissResponse = {
  __typename: 'Announcement_DismissResponse';
  success: Scalars['Boolean'];
};

export type AppCreator = {
  __typename: 'AppCreator';
  name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  idPlugin?: Maybe<Scalars['String']>;
  iconClass?: Maybe<Scalars['String']>;
  urlSuffix?: Maybe<Scalars['String']>;
};

/** Details of an Atlassian Account */
export type AtlassianAccount = {
  __typename: 'AtlassianAccount';
  email: Scalars['String'];
};

/** An object representing an attachment belonging to a card */
export type Attachment = {
  __typename: 'Attachment';
  /** The ID of the attachment */
  id: Scalars['ID'];
  /** The size of the attachment in bytes */
  bytes: Scalars['Int'];
  /** The date the attachment was added */
  date: Scalars['String'];
  /** For image attachments, the extracted edge color */
  edgeColor?: Maybe<Scalars['String']>;
  /** The ID of the member who added the attachment */
  idMember: Scalars['ID'];
  /** Whether the attachment was uploaded */
  isUpload: Scalars['Boolean'];
  /** The mimeType for the attachment */
  mimeType?: Maybe<Scalars['String']>;
  /** The name of the attachment */
  name: Scalars['String'];
  /** The position of the attachment in the attachments list */
  pos: Scalars['Float'];
  /** If the attachment is an image, an array of generated previews of the image in various sizes */
  previews?: Maybe<Array<Attachment_Preview>>;
  /** The URL to the attachment */
  url: Scalars['String'];
};

/** A filter for the Attachments being requested */
export const Attachment_Filter = {
  /** Only attachments which are Card covers */
  Cover: 'cover'
} as const;

export type Attachment_Filter = typeof Attachment_Filter[keyof typeof Attachment_Filter];
export type Attachment_Preview = {
  __typename: 'Attachment_Preview';
  /** The size of the attachment preview in bytes */
  bytes: Scalars['Int'];
  /** The URL to the preview */
  url: Scalars['String'];
  /** The height of the image */
  height: Scalars['Int'];
  /** The width of the image */
  width: Scalars['Int'];
  /** Whether or not the image was scaled */
  scaled: Scalars['Boolean'];
};

/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type Board = {
  __typename: 'Board';
  /** The Actions taken on this Board */
  actions: Array<Action>;
  /** The ids of plugins that a board has enabled */
  boardPlugins: Array<BoardPlugin>;
  /** The Butler Buttons the board owns */
  privateButlerButtons: Array<ButlerButton>;
  sharedButlerButtons: Array<ButlerButton>;
  butlerButtonOverrides?: Maybe<Array<ButlerButtonOverrides>>;
  /** The limit for how many Butler buttons a board can show */
  butlerButtonLimit: Scalars['Int'];
  /** The Cards on the Board */
  cards: Array<Card>;
  /** The CustomFields configured for the Board */
  customFields: Array<CustomField>;
  /** The Members on the Board */
  members: Array<Member>;
  /** The Organization this Board belongs to */
  organization?: Maybe<Organization>;
  /** The Lists on the Board */
  lists: Array<List>;
  /** The Member's preferences specific to this Board */
  myPrefs: MyPrefs;
  /** The Labels on this Board */
  labels: Array<Label>;
  /** The counts of membership types on this Board */
  membershipCounts?: Maybe<MembershipCounts>;
  /** The Plugins on the Board */
  plugins: Array<Plugin>;
  /** The PluginData for this Board */
  pluginData: Array<PluginData>;
  /** The premium features allowed for this board */
  premiumFeatures: Array<PremiumFeatures>;
  /** The counts for this Board being starred */
  starCounts?: Maybe<StarCounts>;
  /** A specific Export on this board */
  export?: Maybe<Export>;
  /** The Exports on this Board */
  exports: Array<Export>;
  /** The tiles configured for the board's dashboard view */
  dashboardViewTiles: Array<Board_DashboardViewTile>;
  dashboardViewTile?: Maybe<Board_DashboardViewTile>;
  /** Historical data for the board */
  history?: Maybe<Board_History>;
  /** The ID of the Board */
  id: Scalars['ID'];
  /** The ID of the Template the board was copied from */
  idBoardSource: Scalars['ID'];
  /** The name of the Board */
  name: Scalars['String'];
  /** Boolean whether the board has been closed or not */
  closed: Scalars['Boolean'];
  /** How the Board was created */
  creationMethod?: Maybe<CreationMethod>;
  /** The date that the last activity occured on the Board */
  dateLastActivity?: Maybe<Scalars['String']>;
  /** The date that the current Member last viewed the Board */
  dateLastView?: Maybe<Scalars['String']>;
  /** The date that plugins are scheduled to be disabled */
  datePluginDisable?: Maybe<Scalars['String']>;
  /** The description of the Board (About this Board) */
  desc: Scalars['String'];
  /** If the description includes custom emoji, this object will contain the information necessary to display them. */
  descData?: Maybe<Scalars['JSONString']>;
  /** Boolean whether the board belongs to an Enterprise */
  enterpriseOwned: Scalars['Boolean'];
  /** MongoID of the Enterprise to which the board belongs */
  idEnterprise?: Maybe<Scalars['String']>;
  /** MongoID of the organization to which the board belongs */
  idOrganization?: Maybe<Scalars['String']>;
  /** The ids for the Collections(Tags) that the Board is part of */
  idTags: Array<Scalars['String']>;
  /** The limits on the Board */
  limits: Board_Limits;
  /** Object containing color keys and the label names given for one label of each color on the board */
  labelNames: Board_LabelNames;
  /** The Memberships of the Board */
  memberships: Array<Board_Membership>;
  /** Boolean whether the board has been pinned or not */
  pinned: Scalars['Boolean'];
  /** Short for 'preferences', these are the settings for the board */
  prefs?: Maybe<Board_Prefs>;
  /** The field that determine how a template renders in the template gallery */
  templateGallery?: Maybe<TemplateGallery>;
  /** Persistent URL for the board */
  url: Scalars['String'];
  /** URL for the board using only its shortMongoID */
  shortUrl: Scalars['String'];
  /** The shortMongoId for this Board */
  shortLink: Scalars['String'];
  /** Whether the board has been starred by the current user */
  starred: Scalars['Boolean'];
  /** View and copy counts for the board */
  stats?: Maybe<Board_Stats>;
  /** Whether the current Member is subscribed to the Board */
  subscribed: Scalars['Boolean'];
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardActionsArgs = {
  filter?: Maybe<Array<Action_Type>>;
  limit?: Maybe<Scalars['Int']>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardCardsArgs = {
  filter?: Maybe<Card_Filter>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardMembersArgs = {
  filter?: Maybe<Member_Filter>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardListsArgs = {
  filter?: Maybe<List_Filter>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardLabelsArgs = {
  limit?: Maybe<Scalars['Int']>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardMembershipCountsArgs = {
  filter?: Maybe<MembershipCounts_Filter>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardPluginsArgs = {
  filter?: Maybe<Plugin_Filter>;
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardExportArgs = {
  id: Scalars['ID'];
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardExportsArgs = {
  id: Scalars['ID'];
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardDashboardViewTileArgs = {
  id: Scalars['ID'];
};


/** Boards are fundamental to Trello. A board may belong to 0 or 1 teams and can have 0 or more lists. */
export type BoardStatsArgs = {
  id: Scalars['ID'];
};

export type BoardAccessRequest = {
  __typename: 'BoardAccessRequest';
  requested: Scalars['Boolean'];
};

/** Object that represents the response of requestBoardAccess mutation */
export type BoardAccessRequest_Response = {
  __typename: 'BoardAccessRequest_Response';
  /** Whether requesting access was successful */
  success: Scalars['Boolean'];
};

export type BoardEntity = {
  __typename: 'BoardEntity';
  id?: Maybe<Scalars['String']>;
  shortLink?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type BoardNotificationData = {
  __typename: 'BoardNotificationData';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shortLink?: Maybe<Scalars['String']>;
};

/** Board Plugin schema */
export type BoardPlugin = {
  __typename: 'BoardPlugin';
  id: Scalars['ID'];
  idPlugin: Scalars['ID'];
};

/** A starred Board for a Member */
export type BoardStar = {
  __typename: 'BoardStar';
  /** The ID of the BoardStar relationship */
  id: Scalars['ID'];
  /** The ID of the Board */
  idBoard: Scalars['String'];
  /** The relative position of the starred Board */
  pos: Scalars['Int'];
};

export type Board_DashboardViewTile = {
  __typename: 'Board_DashboardViewTile';
  id: Scalars['ID'];
  /** The type of this tile */
  type: Scalars['String'];
  /** The start of the timeframe for historical charts */
  from?: Maybe<Board_DashboardViewTile_From>;
  /** The position of this tile in the dashboard */
  pos: Scalars['Int'];
  /** The date this tile was last modified */
  dateLastActivity: Scalars['String'];
  /** The configuration of this tile's graph */
  graph: Board_DashboardViewTile_Graph;
};

export type Board_DashboardViewTile_From = {
  __typename: 'Board_DashboardViewTile_From';
  /** Either absolute or relative */
  dateType: Scalars['String'];
  /**
   * Either a unix timestamp (ms) for an absolute date, or an offset (ms)
   * for relative dates
   */
  value: Scalars['Int'];
};

export type Board_DashboardViewTile_Graph = {
  __typename: 'Board_DashboardViewTile_Graph';
  /** The type of graph (bar, pie, ...) */
  type: Scalars['String'];
};

/** A filter for the Boards being requested */
export const Board_Filter = {
  /** Returns all boards that are open */
  Open: 'open',
  /** Returns all boards that are closed */
  Closed: 'closed',
  /** Returns all boards that have visibility set to Private */
  Members: 'members',
  /** Returns all boards that have visibility set to Team */
  Organization: 'organization',
  /** Returns all boards that have visibility set to Public. */
  Public: 'public',
  /** Returns all boards that have been starred (avoid using). Note: Currently this filter is not updating in real-time. */
  Starred: 'starred',
  /** Returns all boards that are templates. */
  Template: 'template'
} as const;

export type Board_Filter = typeof Board_Filter[keyof typeof Board_Filter];
/** A board's historical data */
export type Board_History = {
  __typename: 'Board_History';
  /** The id of the board the history is for. */
  id: Scalars['ID'];
  /** Data for the # of cards in each of the board's lists over time */
  cardsPerList: Board_History_CardsPerList;
  /** Data for the # of cards assigned to each of the board's labels over time */
  cardsPerLabel: Board_History_CardsPerLabel;
  /** Data for the # of cards assigned to each of the board's members over time */
  cardsPerMember: Board_History_CardsPerMember;
  /** Data for the # of cards whose due date is in each of the different due date states */
  cardsPerDueDateStatus: Board_History_CardsPerDueDateStatus;
};


/** A board's historical data */
export type Board_HistoryCardsPerListArgs = {
  from?: Maybe<Scalars['String']>;
};


/** A board's historical data */
export type Board_HistoryCardsPerLabelArgs = {
  from?: Maybe<Scalars['String']>;
};


/** A board's historical data */
export type Board_HistoryCardsPerMemberArgs = {
  from?: Maybe<Scalars['String']>;
};


/** A board's historical data */
export type Board_HistoryCardsPerDueDateStatusArgs = {
  from?: Maybe<Scalars['String']>;
};

/** A board's cardsPerDueDateStatus history */
export type Board_History_CardsPerDueDateStatus = {
  __typename: 'Board_History_CardsPerDueDateStatus';
  /**
   * The board history API has limits on how many actions can be processed. This field
   * says whether or not the result being returned is complete or not.
   */
  complete: Scalars['Boolean'];
  /** The timeseries for each due date status */
  series: Board_History_CardsPerDueDateStatus_Series;
};

/** A set of series for each different due date status */
export type Board_History_CardsPerDueDateStatus_Series = {
  __typename: 'Board_History_CardsPerDueDateStatus_Series';
  noDueDate: Array<Board_History_CardsPerDueDateStatus_Series_DataPoint>;
  overdue: Array<Board_History_CardsPerDueDateStatus_Series_DataPoint>;
  dueSoon: Array<Board_History_CardsPerDueDateStatus_Series_DataPoint>;
  dueLater: Array<Board_History_CardsPerDueDateStatus_Series_DataPoint>;
  done: Array<Board_History_CardsPerDueDateStatus_Series_DataPoint>;
};

export type Board_History_CardsPerDueDateStatus_Series_DataPoint = {
  __typename: 'Board_History_CardsPerDueDateStatus_Series_DataPoint';
  /** The data point timestamp */
  dateTime: Scalars['String'];
  /** The number of cards in the DueDateStatus */
  value: Scalars['Int'];
};

/** A board's cardsPerLabel history */
export type Board_History_CardsPerLabel = {
  __typename: 'Board_History_CardsPerLabel';
  /**
   * The board history API has limits on how many actions can be processed. This field
   * says whether or not the result being returned is complete or not.
   */
  complete: Scalars['Boolean'];
  /** The timeseries for each of the board's Labels */
  series: Array<Board_History_CardsPerLabel_Series>;
};

/** A Label history timeseries */
export type Board_History_CardsPerLabel_Series = {
  __typename: 'Board_History_CardsPerLabel_Series';
  /** The id of the Label the history is for */
  idLabel: Scalars['ID'];
  /** The data points of the timeseries */
  dataPoints: Array<Board_History_CardsPerLabel_Series_DataPoint>;
};

export type Board_History_CardsPerLabel_Series_DataPoint = {
  __typename: 'Board_History_CardsPerLabel_Series_DataPoint';
  /** The data point timestamp */
  dateTime: Scalars['String'];
  /** The number of cards in the Label */
  value: Scalars['Int'];
};

/** A board's cardsPerList history */
export type Board_History_CardsPerList = {
  __typename: 'Board_History_CardsPerList';
  /**
   * The board history API has limits on how many actions can be processed. This field
   * says whether or not the result being returned is complete or not.
   */
  complete: Scalars['Boolean'];
  /** The timeseries for each of the board's lists */
  series: Array<Board_History_CardsPerList_Series>;
};

/** A list history timeseries */
export type Board_History_CardsPerList_Series = {
  __typename: 'Board_History_CardsPerList_Series';
  /** The id of the list the history is for */
  idList: Scalars['ID'];
  /** The data points of the timeseries */
  dataPoints: Array<Board_History_CardsPerList_Series_DataPoint>;
};

export type Board_History_CardsPerList_Series_DataPoint = {
  __typename: 'Board_History_CardsPerList_Series_DataPoint';
  /** The data point timestamp */
  dateTime: Scalars['String'];
  /** The number of cards in the list */
  value: Scalars['Int'];
};

/** A board's cardsPerMember history */
export type Board_History_CardsPerMember = {
  __typename: 'Board_History_CardsPerMember';
  /**
   * The board history API has limits on how many actions can be processed. This field
   * says whether or not the result being returned is complete or not.
   */
  complete: Scalars['Boolean'];
  /** The timeseries for each of the board's Members */
  series: Array<Board_History_CardsPerMember_Series>;
};

/** A Member history timeseries */
export type Board_History_CardsPerMember_Series = {
  __typename: 'Board_History_CardsPerMember_Series';
  /** The id of the Member the history is for */
  idMember: Scalars['ID'];
  /** The data points of the timeseries */
  dataPoints: Array<Board_History_CardsPerMember_Series_DataPoint>;
};

export type Board_History_CardsPerMember_Series_DataPoint = {
  __typename: 'Board_History_CardsPerMember_Series_DataPoint';
  /** The data point timestamp */
  dateTime: Scalars['String'];
  /** The number of cards in the Member */
  value: Scalars['Int'];
};

/**
 * An object containing each of the Label colors used on a board, with their
 * corresponding names. If there are multiple labels using the same color, the first
 * name will be used.
 */
export type Board_LabelNames = {
  __typename: 'Board_LabelNames';
  /** The first green label's name */
  green: Scalars['String'];
  /** The first yellow label's name */
  yellow: Scalars['String'];
  /** The first orange label's name */
  orange: Scalars['String'];
  /** The first red label's name */
  red: Scalars['String'];
  /** The first purple label's name */
  purple: Scalars['String'];
  /** The first blue label's name */
  blue: Scalars['String'];
  /** The first sky label's name */
  sky: Scalars['String'];
  /** The first lime label's name */
  lime: Scalars['String'];
  /** The first pink label's name */
  pink: Scalars['String'];
  /** The first black label's name */
  black: Scalars['String'];
};

/** The limits on the Board */
export type Board_Limits = {
  __typename: 'Board_Limits';
  /** The board-attachment limits */
  attachments: Board_Limits_Attachments;
  /** The board limits */
  boards: Board_Limits_Boards;
  /** The board-card limits */
  cards: Board_Limits_Cards;
  /** The board-checklist limits */
  checklists: Board_Limits_Checklists;
  /** The board-checkItem limits */
  checkItems: Board_Limits_CheckItems;
  /** The board-customField limits */
  customFields: Board_Limits_CustomFields;
  /** The board-customFieldOption limits */
  customFieldOptions: Board_Limits_CustomFieldOptions;
  /** The board-label limits */
  labels: Board_Limits_Labels;
  /** The board-list limits */
  lists: Board_Limits_Lists;
  /** The board-stickers limits */
  stickers: Board_Limits_Stickers;
  /** The board-reaction limits */
  reactions: Board_Limits_Reactions;
};

/** The board-attachment limits */
export type Board_Limits_Attachments = {
  __typename: 'Board_Limits_Attachments';
  /** Attachments per Board limit */
  perBoard: Limit;
  /** Attachments per Card limit */
  perCard: Limit;
};

/** The board limits */
export type Board_Limits_Boards = {
  __typename: 'Board_Limits_Boards';
  /** Total Members per Board limit */
  totalMembersPerBoard: Limit;
};

/** The board-card limits */
export type Board_Limits_Cards = {
  __typename: 'Board_Limits_Cards';
  /** Open Cards per Board limit */
  openPerBoard: Limit;
  /** Total Cards per Board limit */
  totalPerBoard: Limit;
  /** Open Cards per List limit */
  openPerList: Limit;
  /** Total Cards per List limit */
  totalPerList: Limit;
};

/** The board-checkItem limits */
export type Board_Limits_CheckItems = {
  __typename: 'Board_Limits_CheckItems';
  /** CheckItems per Checklist Limit */
  perChecklist: Limit;
};

/** The board-checklist limits */
export type Board_Limits_Checklists = {
  __typename: 'Board_Limits_Checklists';
  /** Checklists per Board limit */
  perBoard: Limit;
  /** Checklists per Card limit */
  perCard: Limit;
};

/** The board-customFieldOptions limits */
export type Board_Limits_CustomFieldOptions = {
  __typename: 'Board_Limits_CustomFieldOptions';
  /** CustomFieldOptions per CustomField limit */
  perField: Limit;
};

/** The board-customField limits */
export type Board_Limits_CustomFields = {
  __typename: 'Board_Limits_CustomFields';
  /** CustomFields per Board limit */
  perBoard: Limit;
};

/** The board-labeljj limits */
export type Board_Limits_Labels = {
  __typename: 'Board_Limits_Labels';
  /** Labels per Board limit */
  perBoard: Limit;
};

/** The board-list limits */
export type Board_Limits_Lists = {
  __typename: 'Board_Limits_Lists';
  /** Open Lists per Board limit */
  openPerBoard: Limit;
  /** Total Lists per Board limit */
  totalPerBoard: Limit;
};

/** The board-reaction limits */
export type Board_Limits_Reactions = {
  __typename: 'Board_Limits_Reactions';
  /** Reactions per Action limit */
  perAction: Limit;
  /** Unique Reactions per Action limit */
  uniquePerAction: Limit;
};

/** The board-sticker limits */
export type Board_Limits_Stickers = {
  __typename: 'Board_Limits_Stickers';
  /** Stickers per Card limit */
  perCard: Limit;
};

/** An association between a Member and a Board */
export type Board_Membership = {
  __typename: 'Board_Membership';
  /** The ID of the Membership */
  id: Scalars['String'];
  /** The ID of the Member */
  idMember: Scalars['String'];
  /** The type of Membership this is */
  memberType: Board_Membership_MemberType;
  /** Whether the Member has confirmed their email address */
  unconfirmed: Scalars['Boolean'];
  /** Whether the Member has been deactivated */
  deactivated: Scalars['Boolean'];
};

/** The type of membership a member has on a Board */
export const Board_Membership_MemberType = {
  /** A normal member */
  Normal: 'normal',
  /** An observer (no write permissions) */
  Observer: 'observer',
  /** An admin */
  Admin: 'admin'
} as const;

export type Board_Membership_MemberType = typeof Board_Membership_MemberType[keyof typeof Board_Membership_MemberType];
/** The preferences for a Board */
export type Board_Prefs = {
  __typename: 'Board_Prefs';
  /** The permission level (visibility) of the Board */
  permissionLevel: Board_Prefs_PermissionLevel;
  /** Whether voting is enabled on the Board */
  voting: Scalars['Boolean'];
  /** The comment permissions for the Board */
  comments: Board_Prefs_Comments;
  /** The invite permissions for the Board */
  invitations: Board_Prefs_Invitations;
  /** Whether users are allowed to join the Board without invite */
  selfJoin: Scalars['Boolean'];
  /** Whether Card covers are enabled */
  cardCovers: Scalars['Boolean'];
  /** The Card aging mode */
  cardAging: Board_Prefs_CardAging;
  /** Whether a calendar feed is enabled for the Board */
  calendarFeedEnabled: Scalars['Boolean'];
  /** The Board background (can be a color like 'orange' or an ID */
  background: Scalars['String'];
  /** The Board background (can be a color like 'orange' or an ID) */
  backgroundImage?: Maybe<Scalars['String']>;
  /** Pre-scaled background images for the Board */
  backgroundImageScaled?: Maybe<Array<Board_Prefs_BackgroundImageScaled>>;
  /** Whether the background should tile */
  backgroundTile: Scalars['Boolean'];
  /** Whether the background is considered 'dark' or 'light' */
  backgroundBrightness: Board_Prefs_BackgroundBrightness;
  /** Hex color for the Board background */
  backgroundColor?: Maybe<Scalars['String']>;
  /** Hex color for the tope of the background */
  backgroundTopColor: Scalars['String'];
  /** Hex color for the bottom of the background */
  backgroundBottomColor: Scalars['String'];
  /** Whether the Board visibility can be set to Public */
  canBePublic: Scalars['Boolean'];
  /** Whether the Board visibility can be set to Enterprise */
  canBeEnterprise: Scalars['Boolean'];
  /** Whether the Board visibility can be set to Organization */
  canBeOrg: Scalars['Boolean'];
  /** Whether the Board visibility can be set to Private */
  canBePrivate: Scalars['Boolean'];
  /** Whether invitations are enabled for the Board */
  canInvite: Scalars['Boolean'];
  /** Whether votes from other members are hidden on this Board */
  hideVotes: Scalars['Boolean'];
  /** Whether this Board is a Template */
  isTemplate: Scalars['Boolean'];
};

/** The brightness of the Board background */
export const Board_Prefs_BackgroundBrightness = {
  Light: 'light',
  Dark: 'dark'
} as const;

export type Board_Prefs_BackgroundBrightness = typeof Board_Prefs_BackgroundBrightness[keyof typeof Board_Prefs_BackgroundBrightness];
/** A pre-scaled version of the Board background */
export type Board_Prefs_BackgroundImageScaled = {
  __typename: 'Board_Prefs_BackgroundImageScaled';
  width: Scalars['Int'];
  height: Scalars['Int'];
  url: Scalars['String'];
};

/** The card aging mode of the Board */
export const Board_Prefs_CardAging = {
  /** Cards don't age */
  Regular: 'regular',
  /** Cards age in Lists */
  Pirate: 'pirate'
} as const;

export type Board_Prefs_CardAging = typeof Board_Prefs_CardAging[keyof typeof Board_Prefs_CardAging];
/** Board commenting permissions */
export const Board_Prefs_Comments = {
  /** Board members can comment */
  Members: 'members',
  /** Organization members can comment */
  Org: 'org',
  /** Obververs can comment */
  Observers: 'observers',
  /** Anyone can comment */
  Public: 'public',
  /** Comments are disabled */
  Disabled: 'disabled'
} as const;

export type Board_Prefs_Comments = typeof Board_Prefs_Comments[keyof typeof Board_Prefs_Comments];
/** Board invitation permissions */
export const Board_Prefs_Invitations = {
  /** Only admins can invite more Members */
  Admins: 'admins',
  /** All Board Members can invite more Members */
  Members: 'members'
} as const;

export type Board_Prefs_Invitations = typeof Board_Prefs_Invitations[keyof typeof Board_Prefs_Invitations];
/** The permission level (visibility) of an Board */
export const Board_Prefs_PermissionLevel = {
  /** Visible to to Enterprise members */
  Enterprise: 'enterprise',
  /** Only visible to Board members */
  Private: 'private',
  /** Visible to everyone */
  Public: 'public',
  /** Visible to the Organization members */
  Org: 'org'
} as const;

export type Board_Prefs_PermissionLevel = typeof Board_Prefs_PermissionLevel[keyof typeof Board_Prefs_PermissionLevel];
/** View and Copy counts of the Board */
export type Board_Stats = {
  __typename: 'Board_Stats';
  /** Number of copy actions on the board */
  copyCount: Scalars['Int'];
  /** Number of logged in views of the board */
  viewCount: Scalars['Int'];
};

/** Butler Buttons schema */
export type ButlerButton = {
  __typename: 'ButlerButton';
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  /**
   * Scalar representing `object`; today this is really just a string,
   * but eventually should represent a full Butler command.
   */
  cmd: Scalars['ButlerCommand'];
  image: Scalars['String'];
  label: Scalars['String'];
  type: Scalars['String'];
  pos: Scalars['Int'];
  idMemberOwner: Scalars['ID'];
  close?: Maybe<Scalars['Boolean']>;
};

/** Butler Buttons overrides schema */
export type ButlerButtonOverrides = {
  __typename: 'ButlerButtonOverrides';
  idButton: Scalars['ID'];
  idMember: Scalars['ID'];
  idBoard: Scalars['ID'];
  overrideTime: Scalars['Int'];
  overrides: ButlerButtonOverrides_Overrides;
};

/** Butler Buttons override options */
export type ButlerButtonOverrides_Overrides = {
  __typename: 'ButlerButtonOverrides_Overrides';
  enabled: Scalars['Boolean'];
};


/** Ad Campaigns in Trello */
export type Campaign = {
  __typename: 'Campaign';
  id: Scalars['ID'];
  name: Scalars['String'];
  dateDismissed?: Maybe<Scalars['String']>;
  currentStep: Scalars['String'];
};

/** Lists in Trello contain Cards. A Card belongs to exactly one List. */
export type Card = {
  __typename: 'Card';
  /** The Attachments belonging to the card */
  attachments: Array<Attachment>;
  /** The members on this card */
  members: Array<Member>;
  /** The Checklists belonging to the Card */
  checklists: Array<Checklist>;
  /** The CustomFields configured for the Board */
  customFields: Array<CustomField>;
  /** The CustomFieldItems on this Card */
  customFieldItems: Array<CustomFieldItem>;
  /** The Board the Card is on */
  board: Board;
  /** The Labels on this Card */
  labels: Array<Label>;
  /** The List the Card is on */
  list: List;
  /** The PluginData for this Card */
  pluginData: Array<PluginData>;
  /** The Stickers on the card */
  stickers: Array<Sticker>;
  /** The ID of the card. */
  id: Scalars['ID'];
  /** Pieces of information about the card that are displayed on the front of the card. */
  badges: Card_Badges;
  /** Whether the card is closed (archived). Note: Archived lists and boards do not cascade archives to cards. A card can have closed: false but be on an archived board. */
  closed: Scalars['Boolean'];
  /** How the Card was created */
  creationMethod?: Maybe<CreationMethod>;
  /** The datetime of the last activity on the card. Note: There are activities that update dateLastActivity that do not create a corresponding action. For instance, updating the name field of a checklist item on a card does not create an action but does update the card and board's dateLastActivity value. */
  dateLastActivity: Scalars['String'];
  /** The description for the card. Up to 16384 chars. */
  desc: Scalars['String'];
  /** If the description includes custom emoji, this object will contain the information necessary to display them. */
  descData?: Maybe<Scalars['JSONString']>;
  /** The due date on the card, if one exists. */
  due?: Maybe<Scalars['String']>;
  /** Whether the due date has been marked complete. */
  dueComplete: Scalars['Boolean'];
  /** The number of minutes before the due date that the Member should be notified. No value indicates the default (5 minutes). */
  dueReminder?: Maybe<Scalars['String']>;
  /** The email address of the Card, emails sent to this address will appear as a comment by the current Member on the Card */
  email?: Maybe<Scalars['String']>;
  /** The id of the attachment selected as the cover image, if one exists. */
  idAttachmentCover?: Maybe<Scalars['ID']>;
  /** The ID of the board the card is on. */
  idBoard: Scalars['ID'];
  /** An array of checklist IDs that are on this card. */
  idChecklists: Array<Scalars['ID']>;
  /** An array of label IDs that are on this card. */
  idLabels: Array<Scalars['ID']>;
  /** The ID of the list the card is in. */
  idList: Scalars['ID'];
  /** An array of member IDs that are on this card. */
  idMembers: Array<Scalars['ID']>;
  /** An array of member IDs who have voted on this card. */
  idMembersVoted: Array<Scalars['ID']>;
  /** Numeric ID for the card on this board. Only unique to the board, and subject to change as the card moves. */
  idShort: Scalars['Int'];
  /** The limits on the Card */
  limits: Card_Limits;
  /** Whether the card cover image was selected automatically by Trello, or manually by the user. */
  manualCoverAttachment: Scalars['Boolean'];
  /** Name of the card. */
  name: Scalars['String'];
  /** Position of the card in the list. */
  pos: Scalars['Float'];
  /** The 8 character shortened ID for the card. */
  shortLink: Scalars['String'];
  /** URL to the card without the name slug. */
  shortUrl: Scalars['String'];
  /** Start date of the card */
  start: Scalars['String'];
  /** Whether this member is subscribed to the card. */
  subscribed: Scalars['Boolean'];
  /** Full URL to the card, with the name slug. */
  url: Scalars['String'];
  /** Address of card location. */
  address?: Maybe<Scalars['String']>;
  /** Name of card location. */
  locationName?: Maybe<Scalars['String']>;
  /** An object containing keys for latitude and longitude whose values are numbers between -180 and 180. */
  coordinates?: Maybe<Card_Coordinates>;
  /** A string containing the signed static map URL for google API */
  staticMapUrl?: Maybe<Scalars['String']>;
  /** An object containing the cover information of the card. */
  cover?: Maybe<Card_Cover>;
  /** Whether this Card is a Template */
  isTemplate: Scalars['Boolean'];
  /** The role/type of the card */
  cardRole?: Maybe<CardRole>;
  /** The role/type whose criteria are met by the card */
  possibleCardRole?: Maybe<CardRole>;
};


/** Lists in Trello contain Cards. A Card belongs to exactly one List. */
export type CardAttachmentsArgs = {
  filter?: Maybe<Attachment_Filter>;
};


/** Lists in Trello contain Cards. A Card belongs to exactly one List. */
export type CardChecklistsArgs = {
  filter?: Maybe<Checklist_Filter>;
};

export type CardEntity = {
  __typename: 'CardEntity';
  due?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  shortLink?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** Advanced date for representing relative and absolute dates in views */
export type CardFilter_AdvancedDate = {
  __typename: 'CardFilter_AdvancedDate';
  dateType: Scalars['String'];
  value: Scalars['Int'];
};

export const CardFilter_AdvancedDate_DateType = {
  Relative: 'relative',
  Absolute: 'absolute'
} as const;

export type CardFilter_AdvancedDate_DateType = typeof CardFilter_AdvancedDate_DateType[keyof typeof CardFilter_AdvancedDate_DateType];
/** A Date Range for Workspace Views */
export type CardFilter_Criteria_DateRange = {
  __typename: 'CardFilter_Criteria_DateRange';
  start?: Maybe<CardFilter_AdvancedDate>;
  end?: Maybe<CardFilter_AdvancedDate>;
  special?: Maybe<CardFilter_Criteria_DateRange_Special>;
};

export const CardFilter_Criteria_DateRange_Special = {
  Any: 'any',
  None: 'none'
} as const;

export type CardFilter_Criteria_DateRange_Special = typeof CardFilter_Criteria_DateRange_Special[keyof typeof CardFilter_Criteria_DateRange_Special];
export type CardNotificationData = {
  __typename: 'CardNotificationData';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  idShort?: Maybe<Scalars['Int']>;
  shortLink?: Maybe<Scalars['String']>;
};

export const CardRole = {
  Board: 'board',
  Mirror: 'mirror',
  Separator: 'separator',
  Link: 'link'
} as const;

export type CardRole = typeof CardRole[keyof typeof CardRole];
/** An object containing values necessary to render the front of a card */
export type Card_Badges = {
  __typename: 'Card_Badges';
  /** The number of attachments on the card */
  attachments: Scalars['Int'];
  /** An object containing more granular attachment counts */
  attachmentsByType: Card_Badges_AttachmentsByType;
  /** The count of checkItems on the card */
  checkItems: Scalars['Int'];
  /** The count of checkItems on the card in the 'complete' state */
  checkItemsChecked: Scalars['Int'];
  /** The date of the earliest checkItem due date */
  checkItemsEarliestDue?: Maybe<Scalars['String']>;
  /** The count of comments on the card */
  comments: Scalars['Int'];
  /** A boolean indicating whether the card has a description */
  description: Scalars['Boolean'];
  /** The due date of the Card, if one has been set */
  due?: Maybe<Scalars['String']>;
  /** Whether the due date has been marked as 'complete' */
  dueComplete: Scalars['Boolean'];
  /** The start date of the Card, if one has been set */
  start?: Maybe<Scalars['String']>;
  /** Whether the user is subscribed to the card */
  subscribed: Scalars['Boolean'];
  /** Whether the user has voted on the card */
  viewingMemberVoted: Scalars['Boolean'];
  /** The count of votes on the card */
  votes: Scalars['Int'];
};

/** An object containing counts of attachments by type */
export type Card_Badges_AttachmentsByType = {
  __typename: 'Card_Badges_AttachmentsByType';
  /** The trello-specific attachment counts on the Card */
  trello: Card_Badges_AttachmentsByType_Trello;
};

/** An object containing counts of trello attachments */
export type Card_Badges_AttachmentsByType_Trello = {
  __typename: 'Card_Badges_AttachmentsByType_Trello';
  /** The count of Board attachments on the Card */
  board: Scalars['Int'];
  /** The count of Card attachments on the Card */
  card: Scalars['Int'];
};

/** An object containing keys for latitude and longitude whose values are numbers between -180 and 180 */
export type Card_Coordinates = {
  __typename: 'Card_Coordinates';
  /** The latitude (between -180 and 180) */
  latitude: Scalars['Float'];
  /** The longitude (between -180 and 180) */
  longitude: Scalars['Float'];
};

export type Card_Cover = {
  __typename: 'Card_Cover';
  /** The ID of the image attachment used as the card cover. */
  idAttachment?: Maybe<Scalars['String']>;
  /** The ID of the uploaded background used as the card cover. */
  idUploadedBackground?: Maybe<Scalars['String']>;
  /** The ID of the Power-Up that provided the current card cover. */
  idPlugin?: Maybe<Scalars['String']>;
  /** The color that is used as the card cover. */
  color?: Maybe<Scalars['String']>;
  /** The size of the card cover. It is either normal or full. */
  size?: Maybe<Scalars['String']>;
  /** The brightness for the card cover. It is either dark or light. */
  brightness?: Maybe<Scalars['String']>;
  /** If the cover is an image, an array of generated previews of the image in various sizes */
  scaled?: Maybe<Array<Card_Cover_Scaled>>;
  /** For image covers, the extracted edge color */
  edgeColor?: Maybe<Scalars['String']>;
  /** For shared uploaded backgrounds, the url that the image was downloaded from */
  sharedSourceUrl?: Maybe<Scalars['String']>;
};

export type Card_Cover_Scaled = {
  __typename: 'Card_Cover_Scaled';
  /** The size of the cover preview in bytes */
  bytes: Scalars['Int'];
  /** The URL to the preview */
  url: Scalars['String'];
  /** The height of the image */
  height: Scalars['Int'];
  /** The width of the image */
  width: Scalars['Int'];
  /** Whether or not the image was scaled */
  scaled: Scalars['Boolean'];
};

/** An object representing the response from the deleteCard mutation */
export type Card_DeleteResponse = {
  __typename: 'Card_DeleteResponse';
  /** Whether the deletion was successful */
  success: Scalars['Boolean'];
};

/** A filter for the Cards being requested */
export const Card_Filter = {
  /** Returns all cards that are open in lists that have not been archived */
  Open: 'open',
  /** Returns all cards that are closed or in lists that have been archived */
  Closed: 'closed',
  /** Returns all open cards in lists that are not closed */
  Visible: 'visible',
  /** Returns all template cards */
  Template: 'template',
  /** Returns all cards that have at least one checkItem assigned to the member. Currently only supported if `member(id: 'me')` is the top-level query. */
  CheckItemsAssigned: 'checkItemsAssigned'
} as const;

export type Card_Filter = typeof Card_Filter[keyof typeof Card_Filter];
/** The limits on the Card */
export type Card_Limits = {
  __typename: 'Card_Limits';
  /** The card-attachment limits */
  attachments: Card_Limits_Attachments;
  /** The card-checklist limits */
  checklists: Card_Limits_Checklists;
  /** The card-sticker limits */
  stickers: Card_Limits_Stickers;
};

/** The card-attachment limits */
export type Card_Limits_Attachments = {
  __typename: 'Card_Limits_Attachments';
  /** Attachments per Card limit */
  perCard: Card_Limits_Attachments_PerCard;
};

/** Attachments per Card limit */
export type Card_Limits_Attachments_PerCard = {
  __typename: 'Card_Limits_Attachments_PerCard';
  /** The threshold at which a limit will enter the 'warn' status */
  warnAt: Scalars['Int'];
  /** The threshold at which a limit will enter the 'disabled'/'maxExceeded' status */
  disableAt: Scalars['Int'];
  /** The status of the limit */
  status: LimitStatus;
  /** The count that the limited number is currently at. Will only be populated for limits over the warn threshold */
  count?: Maybe<Scalars['Int']>;
};

/** The card-checklist limits */
export type Card_Limits_Checklists = {
  __typename: 'Card_Limits_Checklists';
  /** Checklists per Card limit */
  perCard: Card_Limits_Checklists_PerCard;
};

/** Checklists per Card limit */
export type Card_Limits_Checklists_PerCard = {
  __typename: 'Card_Limits_Checklists_PerCard';
  /** The threshold at which a limit will enter the 'warn' status */
  warnAt: Scalars['Int'];
  /** The threshold at which a limit will enter the 'disabled'/'maxExceeded' status */
  disableAt: Scalars['Int'];
  /** The status of the limit */
  status: LimitStatus;
  /** The count that the limited number is currently at. Will only be populated for limits over the warn threshold */
  count?: Maybe<Scalars['Int']>;
};

/** The card-sticker limits */
export type Card_Limits_Stickers = {
  __typename: 'Card_Limits_Stickers';
  /** Stickers per Card limit */
  perCard: Card_Limits_Stickers_PerCard;
};

/** Stickers per Card limit */
export type Card_Limits_Stickers_PerCard = {
  __typename: 'Card_Limits_Stickers_PerCard';
  /** The threshold at which a limit will enter the 'warn' status */
  warnAt: Scalars['Int'];
  /** The threshold at which a limit will enter the 'disabled'/'maxExceeded' status */
  disableAt: Scalars['Int'];
  /** The status of the limit */
  status: LimitStatus;
  /** The count that the limited number is currently at. Will only be populated for limits over the warn threshold */
  count?: Maybe<Scalars['Int']>;
};

/** Authentication for Avalara CertCapture tax integration in the client */
export type CertCaptureToken = {
  __typename: 'CertCaptureToken';
  /** Auth token */
  token: Scalars['String'];
};

/** The information about the channel (stable/beta/alpha) the Member is on and what they have access to */
export type Channels = {
  __typename: 'Channels';
  /** Whether the Member is allowed to pick releases from the Channel Switcher */
  dev: Scalars['Boolean'];
  /** The channel the Member is currently using */
  active: Scalars['String'];
  /** The channels the Member is allowed to use */
  allowed: Array<Scalars['String']>;
};

/**
 * CheckItems in Trello are contained within Checklists on a Card. They represent a single
 * task to be done and can be in an 'incomplete' or 'complete' state
 */
export type CheckItem = {
  __typename: 'CheckItem';
  /** The ID of the check item. */
  id: Scalars['ID'];
  /** The ID of the checklist the check item is on. */
  idChecklist: Scalars['ID'];
  /** The name of the check item. */
  name: Scalars['String'];
  /** If the name includes custom emoji, this object will contain the information necessary to display them. */
  nameData?: Maybe<Scalars['JSONString']>;
  /** The position of the check item on the checklist (relative to any other check items on the checklist). */
  pos: Scalars['Float'];
  /** The state of the check item. */
  state: CheckItem_State;
  /** The due date of the check item */
  due?: Maybe<Scalars['String']>;
  /** The id of the member assigned to the check item. */
  idMember?: Maybe<Scalars['ID']>;
  /** A temporary ID that is returned when creating a new check item */
  temporaryId?: Maybe<Scalars['String']>;
};

/** An object representing the response from the deleteCheckItem mutation */
export type CheckItem_DeleteResponse = {
  __typename: 'CheckItem_DeleteResponse';
  /** Whether the deletion was successful */
  success: Scalars['Boolean'];
};

/** A filter for the CardItems being requested */
export const CheckItem_Filter = {
  /** Returns all checkItems */
  All: 'all',
  /** Returns all checkItems assigned to the member. Currently only supported if `member(id: 'me')` is the top-level query. */
  Assigned: 'assigned'
} as const;

export type CheckItem_Filter = typeof CheckItem_Filter[keyof typeof CheckItem_Filter];
/** The completion state of a CheckItem */
export const CheckItem_State = {
  Complete: 'complete',
  Incomplete: 'incomplete'
} as const;

export type CheckItem_State = typeof CheckItem_State[keyof typeof CheckItem_State];
/** CheckLists are a container for CheckItems on a Card */
export type Checklist = {
  __typename: 'Checklist';
  /** The list of CheckItems contained within this Checklist */
  checkItems: Array<CheckItem>;
  /** The cards the Checklist is on */
  cards: Array<Card>;
  /** The ID of the checklist. */
  id: Scalars['ID'];
  /** The ID of the board the checklist is on. */
  idBoard: Scalars['ID'];
  /** The ID of the card the checklist is on. */
  idCard: Scalars['ID'];
  /** The name of the checklist. */
  name: Scalars['String'];
  /** The position of the checklist on the card (relative to any other checklists on the card). */
  pos: Scalars['Float'];
  /** A temporary ID that is returned when creating a new checklist */
  temporaryId?: Maybe<Scalars['String']>;
};


/** CheckLists are a container for CheckItems on a Card */
export type ChecklistCheckItemsArgs = {
  filter?: Maybe<CheckItem_Filter>;
};

/** An object representing the response from the deleteChecklist mutation */
export type Checklist_DeleteResponse = {
  __typename: 'Checklist_DeleteResponse';
  /** Whether the deletion was successful */
  success: Scalars['Boolean'];
};

/** A filter for the Cardlists being requested */
export const Checklist_Filter = {
  /** Returns all checklists */
  All: 'all',
  /** Returns all checklists that have at least one checkItem assigned to the member. Currently only supported if `member(id: 'me')` is the top-level query. */
  CheckItemsAssigned: 'checkItemsAssigned'
} as const;

export type Checklist_Filter = typeof Checklist_Filter[keyof typeof Checklist_Filter];
/**
 * An organization owned by a managed member of an enterprise. This is not a model, but rather just a set
 * of fields of an Organization that is solely used for the enteprise dashboard.
 */
export type ClaimableOrganization = {
  __typename: 'ClaimableOrganization';
  id: Scalars['ID'];
  products: Array<Scalars['Int']>;
  name: Scalars['String'];
  displayName: Scalars['String'];
  idActiveAdmins: Array<Scalars['ID']>;
  activeMembershipCount: Scalars['Int'];
  logoUrl?: Maybe<Scalars['String']>;
};

/**
 * The list of claimable organizations (see below), as well as the total count (the endpoint does not return
 * all of them)
 */
export type ClaimableOrganizations = {
  __typename: 'ClaimableOrganizations';
  organizations: Array<ClaimableOrganization>;
  count: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
};

/** Configuration for creating a CustomField */
export type CreateCustomField_Display = {
  /** Whether the CustomField should be displayed on the card front */
  cardFront: Scalars['Boolean'];
};

export type CreateCustomField_Option = {
  /** The value for the CustomField option */
  value: CreateCustomField_Option_Value;
  /** The color of the CustomField option (can be 'none') */
  color: Scalars['String'];
};

export type CreateCustomField_Option_Value = {
  /** The text value for a CustomField option */
  text: Scalars['String'];
};

export type CreateDashboardViewTile = {
  type: Scalars['String'];
  pos: Scalars['Int'];
  graph: CreateDashboardViewTile_Graph;
  from?: Maybe<CreateDashboardViewTile_From>;
};

export type CreateDashboardViewTile_From = {
  dateType: Scalars['String'];
  value: Scalars['Int'];
};

export type CreateDashboardViewTile_Graph = {
  type: Scalars['String'];
};

/** How an item was created */
export const CreationMethod = {
  /** Item was created to demonstrate Trello features. eg. Cards on the welcome board */
  Demo: 'demo',
  /** Item was generated without the member input, eg. the ToDo board created for new users */
  Automatic: 'automatic',
  /** Item was generated automatically, but with some member input. eg. Cards created through the onboarding flow */
  Assisted: 'assisted'
} as const;

export type CreationMethod = typeof CreationMethod[keyof typeof CreationMethod];
/** A Credit indicates a 'free reward' (typically free bc or gold membership) */
export type Credit = {
  __typename: 'Credit';
  /** The ID of the credit */
  id: Scalars['String'];
  /** The ID of the model these credits are for */
  idModel: Scalars['String'];
  /** The type of entity these credits are for (Member or Organization) */
  modelType: Scalars['String'];
  /** The ID of the member that was invited to earn these credits */
  idMemberInvited?: Maybe<Scalars['String']>;
  /** The count of credits */
  count: Scalars['Int'];
  /** The type of count */
  countType: Scalars['String'];
  /** Whether the credits have been applied */
  applied: Scalars['Boolean'];
  /** The type of Credit this is */
  type: Credit_Type;
  /** A description of how the Credit was rewarded */
  via?: Maybe<Scalars['String']>;
  /** The reward for the Credit (gold or bc) */
  reward?: Maybe<Credit_Reward>;
  /** The member that was invited to earn these credits */
  memberInvited?: Maybe<Member>;
};

/** A reward applicable to a Credit */
export const Credit_Reward = {
  Gold: 'gold',
  Bc: 'bc'
} as const;

export type Credit_Reward = typeof Credit_Reward[keyof typeof Credit_Reward];
/** The type of the Credit */
export const Credit_Type = {
  Invitation: 'invitation',
  PromoCode: 'promoCode',
  Support: 'support',
  FreeTrial: 'freeTrial'
} as const;

export type Credit_Type = typeof Credit_Type[keyof typeof Credit_Type];
/** A configurable field that can be added to a Card, and optionally shown on the Card Front */
export type CustomField = {
  __typename: 'CustomField';
  /** The ID of the CustomField */
  id: Scalars['ID'];
  /** The name of this Custom Field */
  name: Scalars['String'];
  /** The ID of the model that the CustomField is configured for */
  idModel: Scalars['String'];
  /** The type of the model that the CustomField is on (currently only Board) */
  modelType: Scalars['String'];
  /** The computed has of the name and type fields of this CustomField (sometimes used for grouping) */
  fieldGroup: Scalars['String'];
  /** The display options for the CustomField */
  display: CustomField_Display;
  /** The position (on the Card back and Card front) of the CustomField relative to others */
  pos: Scalars['Int'];
  /** The type of CustomField this is */
  type: CustomField_Type;
  /** The list of options available to a 'list' CustomField */
  options?: Maybe<Array<CustomField_Option>>;
};

/** An item representing a value for a particular CustomField on a Card */
export type CustomFieldItem = {
  __typename: 'CustomFieldItem';
  /** The ID of the CustomFieldItem */
  id: Scalars['ID'];
  /** The ID of the CustomField that this item holds a value for */
  idCustomField: Scalars['String'];
  /** The ID of the model this CustomFieldItem is on (the Card ID) */
  idModel: Scalars['String'];
  /** The type of model this CustomFieldItem is on (only Cards are supported) */
  modelType: CustomFieldItem_ModelType;
  /** The id for the CustomField list option */
  idValue: Scalars['String'];
  /** The value for this CustomFieldItem, the shape of this data depends on the type of CustomField this is for */
  value: Scalars['JSONString'];
};

/** The type of model a CustomFieldItem is on (only Cards are supported) */
export const CustomFieldItem_ModelType = {
  Card: 'card'
} as const;

export type CustomFieldItem_ModelType = typeof CustomFieldItem_ModelType[keyof typeof CustomFieldItem_ModelType];
/** Configuration for displaying a CustomField */
export type CustomField_Display = {
  __typename: 'CustomField_Display';
  /** Whether the CustomField should be displayed on the card front */
  cardFront: Scalars['Boolean'];
};

/** An option in the 'list' CustomField */
export type CustomField_Option = {
  __typename: 'CustomField_Option';
  /** The ID of the CustomField option */
  id: Scalars['ID'];
  /** The ID of the CustomField this option belongs to */
  idCustomField: Scalars['String'];
  /** The value for the CustomField option */
  value: CustomField_Option_Value;
  /** The color of the CustomField option (can be 'none') */
  color: Scalars['String'];
  /** An integer indicating the position of the CustomField Option in its list */
  pos: Scalars['Int'];
};

/** The value for a CustomField option */
export type CustomField_Option_Value = {
  __typename: 'CustomField_Option_Value';
  /** The text value for a CustomField option */
  text: Scalars['String'];
};

/** The type of a CustomField */
export const CustomField_Type = {
  Checkbox: 'checkbox',
  Number: 'number',
  List: 'list',
  Date: 'date',
  Text: 'text'
} as const;

export type CustomField_Type = typeof CustomField_Type[keyof typeof CustomField_Type];
export type DueEntity = {
  __typename: 'DueEntity';
  current?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** The name and url of a given email provider that is retrieved from the MX records for a given email address */
export type EmailProvider = {
  __typename: 'EmailProvider';
  /** Name of the email provider e.g. Gmail */
  name: Scalars['String'];
  /** Url to the providers inbox */
  url: Scalars['String'];
};

/** An Enterprise in Trello is made up of many Organizations (teams) */
export type Enterprise = {
  __typename: 'Enterprise';
  /** The ID of the Enterprise */
  id: Scalars['ID'];
  /** A list of teams that can be claimed by an enterprise */
  claimableOrganizations: ClaimableOrganizations;
  /** The display name of the Enterprise */
  displayName: Scalars['String'];
  /** Domains claimed by the Enterprise */
  enterpriseDomains: Array<Scalars['String']>;
  /** Whether this Enterprise has Atlassian Access */
  hasAtlassianAccess: Scalars['Boolean'];
  /** Whether this Enterprise has any claimed domains */
  hasClaimedDomains: Scalars['Boolean'];
  /** The ids of the admins in the enterprise */
  idAdmins: Array<Scalars['String']>;
  /** The ids of the plugins allowed on the Enterprise */
  idPluginsAllowed: Array<Scalars['String']>;
  /** Whether this Enterprise is really an Enterprise, or a Business Class Purchase Order (BCPO) 'Enterprise' */
  isRealEnterprise: Scalars['Boolean'];
  /** Whether this Enterprise is associated with an Atlassian organization */
  isAtlassianOrg: Scalars['Boolean'];
  /** The display name of the associated Atlassian organization, if one exists */
  atlOrgDisplayName?: Maybe<Scalars['String']>;
  /** The hash of the custom logo for the Enterprise */
  logoHash?: Maybe<Scalars['String']>;
  /** The URL of the custom logo for the Enterprise */
  logoUrl?: Maybe<Scalars['String']>;
  /** The name of the Enterprise */
  name: Scalars['String'];
  /** The overridden prefs for individual Organizations owned by the Enterprise */
  organizationPrefs: Organization_Prefs;
  /** Whether the Enterprise has enabled plugin whitelisting restrictions */
  pluginWhitelistingEnabled: Scalars['Boolean'];
  /** The preferences for the Enterprise */
  prefs?: Maybe<Enterprise_Prefs>;
  /** Data used to represent the effects of transferring an organization to an enterprise */
  transferrableData: TransferrableData;
  /** Data regarding the Enterprise's licenses */
  licenses: Enterprise_Licenses;
  /** A list of the enterprise's members who have issues consent tokens for third-party apps */
  managedMembersWithTokens: Array<Member>;
  /** The Auditlog for Enterprises actions */
  auditlog: Array<Enterprise_Auditlog>;
};


/** An Enterprise in Trello is made up of many Organizations (teams) */
export type EnterpriseClaimableOrganizationsArgs = {
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


/** An Enterprise in Trello is made up of many Organizations (teams) */
export type EnterpriseTransferrableDataArgs = {
  idOrganization: Scalars['ID'];
};


/** An Enterprise in Trello is made up of many Organizations (teams) */
export type EnterpriseManagedMembersWithTokensArgs = {
  filter?: Maybe<Scalars['String']>;
};

/** Describing the items inside the audit log */
export type Enterprise_Auditlog = {
  __typename: 'Enterprise_Auditlog';
  idAction: Scalars['ID'];
  type: Action_Type;
  date: Scalars['String'];
  memberCreator?: Maybe<Member>;
  member?: Maybe<Member>;
  plugin?: Maybe<Plugin>;
  board?: Maybe<Board>;
  organization?: Maybe<Organization>;
};

/** An object representing the response from the deleteAllManagedMemberTokens mutation */
export type Enterprise_DeleteAllManagedMemberTokensResponse = {
  __typename: 'Enterprise_DeleteAllManagedMemberTokensResponse';
  success: Scalars['Boolean'];
};

/** An object representing the response from the deleteManagedMemberTokens mutation */
export type Enterprise_DeleteManagedMemberTokensResponse = {
  __typename: 'Enterprise_DeleteManagedMemberTokensResponse';
  success: Scalars['Boolean'];
};

/** A filter for the Enterprises being requested */
export const Enterprise_Filter = {
  /** Only Enterprises that 'own' the Member */
  Owned: 'owned'
} as const;

export type Enterprise_Filter = typeof Enterprise_Filter[keyof typeof Enterprise_Filter];
export type Enterprise_Licenses = {
  __typename: 'Enterprise_Licenses';
  /** The maximum number of members allowed in the Enterprise without purchasing additional seats */
  maxMembers?: Maybe<Scalars['Int']>;
  /** The number of members in the Enterprise */
  totalMembers: Scalars['Int'];
};

/** An object representing the response from the linkEnterpriseWithAtlassianOrganization mutation */
export type Enterprise_LinkAtlassianOrganizationResponse = {
  __typename: 'Enterprise_LinkAtlassianOrganizationResponse';
  success?: Maybe<Scalars['Boolean']>;
};

/** Represents the preferences of an Enterprise */
export type Enterprise_Prefs = {
  __typename: 'Enterprise_Prefs';
  /** The custom branding color for the Enterprise */
  brandingColor?: Maybe<Scalars['String']>;
  /** Whether managed members of the enterprise can issue consent tokens for third-party apps */
  canIssueManagedConsentTokens: Scalars['Boolean'];
};

export type Export = {
  __typename: 'Export';
  id: Scalars['ID'];
  status: ExportStatus;
  size?: Maybe<Scalars['Int']>;
  startedAt?: Maybe<Scalars['String']>;
  exportUrl?: Maybe<Scalars['String']>;
};

export const ExportStage = {
  ExportQueued: 'Export_queued',
  PreparingToExport: 'Preparing_to_export',
  FetchingBoardData: 'Fetching_board_data',
  CreatingArchive: 'Creating_archive',
  ExportCompleted: 'Export_completed',
  ExportFailed: 'Export_failed'
} as const;

export type ExportStage = typeof ExportStage[keyof typeof ExportStage];
export type ExportStatus = {
  __typename: 'ExportStatus';
  attempts: Scalars['Int'];
  finished: Scalars['Boolean'];
  stage: ExportStage;
};



export type GuestOrganization = {
  __typename: 'GuestOrganization';
  id: Scalars['ID'];
  displayName: Scalars['String'];
  logoHash?: Maybe<Scalars['String']>;
};

export type InputButlerButton = {
  label: Scalars['String'];
  image: Scalars['String'];
  cmd: Scalars['ButlerCommand'];
  type: Scalars['String'];
  shared?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  close?: Maybe<Scalars['Boolean']>;
};

/** Advanced date for representing relative and absolute dates in views */
export type InputCardFilter_AdvancedDate = {
  dateType: Scalars['String'];
  value: Scalars['Int'];
};

/** Organization View card filter criteria input */
export type InputCardFilter_Criteria = {
  /** A list of board IDs whose cards will be included in the view */
  idBoards?: Maybe<Array<Scalars['ID']>>;
  idLists?: Maybe<Array<Scalars['ID']>>;
  idMembers?: Maybe<Array<Scalars['ID']>>;
  start?: Maybe<InputCardFilter_Criteria_DateRange>;
  due?: Maybe<InputCardFilter_Criteria_DateRange>;
  labels?: Maybe<Array<Maybe<Scalars['String']>>>;
  dueComplete?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** OrganizationView CardFilter DateRange */
export type InputCardFilter_Criteria_DateRange = {
  start?: Maybe<InputCardFilter_AdvancedDate>;
  end?: Maybe<InputCardFilter_AdvancedDate>;
  special?: Maybe<CardFilter_Criteria_DateRange_Special>;
};

export type InputCover = {
  idAttachment?: Maybe<Scalars['String']>;
  idUploadedBackground?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  brightness?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
};

/** Top level OrganizationView model input for updating an organizationView */
export type InputOrganizationView = {
  /** The name of the organization view */
  name?: Maybe<Scalars['String']>;
  /** An object that describes the permission level of the organization view */
  prefs?: Maybe<InputOrganizationView_Prefs>;
};

/** Prefs argument for creating and updating Organization Views */
export type InputOrganizationView_Prefs = {
  /** The permission level for the organizaiton view. Currently we support 'team' and 'private' */
  permissionLevel: OrganizationView_Prefs_PermissionLevel;
};

/** A single view argument for creating and updating Organzation Views */
export type InputOrganizationView_View = {
  /** An object specifying which cards to include in the view */
  cardFilter?: Maybe<InputOrganizationView_View_CardFilter>;
  /** The type of visualization this view uses, such as 'table' or 'timeline' */
  defaultViewType?: Maybe<Scalars['String']>;
};

/** Organization View card filter input */
export type InputOrganizationView_View_CardFilter = {
  /** An object specifying the criteria that determines which cards are included in the view */
  criteria?: Maybe<Array<InputCardFilter_Criteria>>;
};

export type InputPluginListing = {
  /** The name of the plugin. */
  name: Scalars['String'];
  /** The locale of the listing. */
  locale: Scalars['String'];
  /** The description of the plugin. */
  description: Scalars['String'];
  /** The overview of the plugin. */
  overview: Scalars['String'];
};

/** Response from adding a member to a team */
export type InviteMember_Response = {
  __typename: 'InviteMember_Response';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};


/** Labels are defined per board, and can be applied to the cards on that board */
export type Label = {
  __typename: 'Label';
  /** The ID of the Label */
  id: Scalars['ID'];
  /** The name of the label. */
  name: Scalars['String'];
  /** The ID of the board the label is on. */
  idBoard: Scalars['String'];
  /** The color of the label. */
  color?: Maybe<Scalars['String']>;
};

/** An object containing information about a Limit */
export type Limit = {
  __typename: 'Limit';
  /** The threshold at which a limit will enter the 'warn' status */
  warnAt: Scalars['Int'];
  /** The threshold at which a limit will enter the 'disabled'/'maxExceeded' status */
  disableAt: Scalars['Int'];
  /** The status of the limit */
  status: LimitStatus;
  /** The count that the limited number is currently at. Will only be populated for limits over the warn threshold */
  count?: Maybe<Scalars['Int']>;
};

/** The status of a Limit */
export const LimitStatus = {
  /** The limit is not within the warning range */
  Ok: 'ok',
  /** The limit is at/over the warning threshold */
  Warn: 'warn',
  /** The limit is at the disabled threshold */
  Disabled: 'disabled',
  /** The limit is over the disabled thershold */
  MaxExceeded: 'maxExceeded'
} as const;

export type LimitStatus = typeof LimitStatus[keyof typeof LimitStatus];
/** A Board is made up of vertical Lists which contain Cards */
export type List = {
  __typename: 'List';
  /** The Cards in the List */
  cards: Array<Card>;
  /** The Board that the List is on */
  board: Board;
  /** The ID of the List */
  id: Scalars['String'];
  /** Whether the List is closed (archived) */
  closed: Scalars['Boolean'];
  /** How the List was created */
  creationMethod?: Maybe<CreationMethod>;
  /** The limits on the List */
  limits: List_Limits;
  /** The name of the List */
  name: Scalars['String'];
  /** The ID of the Board the List is on */
  idBoard: Scalars['String'];
  /** The position of the List on the Board */
  pos: Scalars['Float'];
  /** The 'soft' limit of Cards in the List */
  softLimit?: Maybe<Scalars['Int']>;
  /** Whether the Member is subscribed to this List */
  subscribed: Scalars['Boolean'];
};


/** A Board is made up of vertical Lists which contain Cards */
export type ListCardsArgs = {
  filter?: Maybe<Card_Filter>;
};

/** List price quotes for a subscriber */
export type ListPriceQuoteInfo = {
  __typename: 'ListPriceQuoteInfo';
  /** The base price quote info */
  base: PriceQuoteInfo;
  /** The price quote info for the subscriber which might reflect a subscriber-specific discount */
  subscriber: PriceQuoteInfo;
};

/** A filter for the Lists being requested */
export const List_Filter = {
  /** Only open Lists */
  Open: 'open',
  /** Only closed (archived) Lists */
  Closed: 'closed'
} as const;

export type List_Filter = typeof List_Filter[keyof typeof List_Filter];
/** The limits on the List */
export type List_Limits = {
  __typename: 'List_Limits';
  /** The list-card limits */
  cards: List_Limits_Cards;
};

/** The list-card limits */
export type List_Limits_Cards = {
  __typename: 'List_Limits_Cards';
  /** Open Cards per List Limit */
  openPerList: Limit;
  /** Total Cards per List Limit */
  totalPerList: Limit;
};

/** A Login method for a Member */
export type Login = {
  __typename: 'Login';
  /** The ID of the Login */
  id: Scalars['ID'];
  /** The email address associated with this Login */
  email: Scalars['String'];
  /** Whether this is the primary login for this user */
  primary: Scalars['Boolean'];
  /** Whether this email address can be claimed by an org */
  claimable: Scalars['Boolean'];
  /** The types of Login methods that can be used with this email */
  types: Array<Member_LoginType>;
};

/** Everyone with a Trello account is called a member. */
export type Member = {
  __typename: 'Member';
  /** The boards the user is a member of */
  boards: Array<Board>;
  /** The Boards the Member has starred */
  boardStars: Array<BoardStar>;
  /** The ad campaigns the member is in */
  campaigns: Array<Campaign>;
  /** The Credits owned by this Member */
  credits?: Maybe<Array<Credit>>;
  /** The cards the member is on */
  cards: Array<Card>;
  /** The information about the channel (stable/alpha) the Member is on and what they have access to */
  channels?: Maybe<Channels>;
  /** The organizations the user is a member of */
  organizations: Array<Organization>;
  /** The Enterprise licenses granted to the member */
  enterpriseLicenses?: Maybe<Array<Member_EnterpriseLicense>>;
  /** The Enterprises this Member is a part of */
  enterprises: Array<Enterprise>;
  /** The PluginData on this Member */
  pluginData: Array<PluginData>;
  /** The saved search queries for this Member */
  savedSearches: Array<SavedSearch>;
  /** The ID of the member. */
  id: Scalars['ID'];
  /** Whether activity has been blocked for this Member */
  activityBlocked: Scalars['Boolean'];
  /** The Atlassian Account ID of the member. */
  aaId?: Maybe<Scalars['String']>;
  /** The Atlassian Account email of the member. */
  aaEmail?: Maybe<Scalars['String']>;
  /** Whether the member is 'mastered' by Atlassian Account */
  isAaMastered: Scalars['Boolean'];
  /** Date profile syncing from Atlassian account to Trello will be unblocked on the member */
  aaBlockSyncUntil?: Maybe<Scalars['String']>;
  /** Date the member was enrolled to an Atlassian Account */
  aaEnrolledDate?: Maybe<Scalars['String']>;
  /** Date the member was domain claimed by an Atlassian organization */
  domainClaimed?: Maybe<Scalars['String']>;
  /** Count of any credentials removed in Atlassian onboarding process */
  credentialsRemovedCount?: Maybe<Scalars['String']>;
  /** The URL of the current avatar being used, regardless of whether it is a gravatar or uploaded avatar. */
  avatarUrl?: Maybe<Scalars['String']>;
  /** The source of the user's avatar - either via 'upload' or 'gravatar'. */
  avatarSource?: Maybe<Member_AvatarSource>;
  /** Optional bio for the member. */
  bio: Scalars['String'];
  /** If the bio includes custom emoji, this object will contain the information necessary to display them. */
  bioData?: Maybe<Scalars['JSONString']>;
  /** Whether the member has confirmed their email address after signing up. */
  confirmed: Scalars['Boolean'];
  /** The primary email address for the member. You can only read your own. */
  email?: Maybe<Scalars['String']>;
  /** The full display name for the member. */
  fullName?: Maybe<Scalars['String']>;
  /** Same as avatarUrl above; member profile images are hosted at: https://trello-members.s3.amazonaws.com/{idMember}/{gravatarHash}/{size}.png size can be 30, 50, or 170 string. */
  gravatarHash?: Maybe<Scalars['String']>;
  /** An array of board IDs this member is on. */
  idBoards: Array<Scalars['String']>;
  /** An array of organization IDs this member is in. */
  idOrganizations: Array<Scalars['String']>;
  /** The enterprise that 'owns' this Member (i.e this member is owned by a Trello Enterprise customer) */
  idEnterprise?: Maybe<Scalars['String']>;
  /** Enterprises that have explicitly deactivated this member */
  idEnterprisesDeactivated: Array<Scalars['String']>;
  /** The id of the Member that referred this Member to Trello */
  idMemberReferrer?: Maybe<Scalars['String']>;
  /** An array of enterprise IDs this member is an admin of. */
  idEnterprisesAdmin: Array<Scalars['String']>;
  /** An array of organization IDs this member is an admin of. */
  idPremOrgsAdmin: Array<Scalars['String']>;
  /** How many delta updates have been processed by this Member */
  ixUpdate: Scalars['String'];
  /** The member's initials, used for display when there isn't an avatar set. */
  initials?: Maybe<Scalars['String']>;
  /** The types of logins a user can use: password, saml, google, android or atlassian */
  loginTypes?: Maybe<Array<Maybe<Member_LoginType>>>;
  /** The limits on this Member */
  limits: Member_Limits;
  /** Information about if/when the Member has opted in/out of marketing communication */
  marketingOptIn: Member_MarketingOptIn;
  /** One of: 'normal', 'ghost'. A ghost is an individual who has been invited to join but has not yet created a Trello account. */
  memberType: Member_MemberType;
  /** Information about in-app messages that the Member has dismissed */
  messagesDismissed?: Maybe<Array<Member_MessageDismissed>>;
  /** The information the Member has chosen to be non-public */
  nonPublic?: Maybe<Member_NonPublic>;
  /** Whether non public information is available for the Member */
  nonPublicAvailable: Scalars['Boolean'];
  /** A list of the 'one time messages' that have been dismissed by the member */
  oneTimeMessagesDismissed?: Maybe<Array<Scalars['String']>>;
  /** Information about the paid account of Member */
  paidAccount?: Maybe<PaidAccount>;
  /** The preferences (settings) for this member */
  prefs?: Maybe<Member_Prefs>;
  /** The premium features allowed for this member */
  premiumFeatures: Array<PremiumFeatures>;
  /** 10 - member has Trello Gold as a result of being in a Business Class team. 37 - member has monthly Trello Gold. 38 - member has annual Trello Gold. */
  products: Array<Scalars['Int']>;
  /** The trophies the Member has earned */
  trophies: Array<Scalars['String']>;
  /** The URL of the uploaded avatar if one has been uploaded. */
  uploadedAvatarUrl?: Maybe<Scalars['String']>;
  /** The URL to the member's profile page. */
  url: Scalars['String'];
  /** The username for the member. What is shown in @mentions for example. */
  username: Scalars['String'];
  /** The logins for the members. */
  logins: Array<Login>;
  /** The agreements made by the member. */
  agreements: Array<Member_Agreement>;
  /** Atlassian organizations the member belongs to. */
  atlassianOrganizations: Array<Member_Atlassian_Organization>;
  /** Guest organizations the member belongs to. */
  guestOrganizations: Array<GuestOrganization>;
  tokenCount: Scalars['Int'];
  /** Values that monitor the progress of the automatic board migration into teams */
  teamify: Member_Teamify;
  /** The users tokens */
  tokens?: Maybe<Array<Maybe<Token>>>;
  /** Banners which might be visible to the member. */
  banners: Array<Member_Banner>;
  /** Org id for where the gold promo free trial was activated */
  goldSunsetFreeTrialIdOrganization: Scalars['String'];
};


/** Everyone with a Trello account is called a member. */
export type MemberBoardsArgs = {
  filter?: Maybe<Board_Filter>;
};


/** Everyone with a Trello account is called a member. */
export type MemberCreditsArgs = {
  filter: Array<Credit_Type>;
};


/** Everyone with a Trello account is called a member. */
export type MemberCardsArgs = {
  filter?: Maybe<Card_Filter>;
};


/** Everyone with a Trello account is called a member. */
export type MemberOrganizationsArgs = {
  filter?: Maybe<Organization_Filter>;
};


/** Everyone with a Trello account is called a member. */
export type MemberEnterprisesArgs = {
  filter?: Maybe<Enterprise_Filter>;
};

export type MemberEntity = {
  __typename: 'MemberEntity';
  id?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

/** Member as Input for adding a member to a team */
export type MemberOrEmail = {
  id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
};

/** The agreements made by the member */
export type Member_Agreement = {
  __typename: 'Member_Agreement';
  id: Scalars['ID'];
  agreementType: Scalars['String'];
};

/** Atlassian Organizations the member is a part of */
export type Member_Atlassian_Organization = {
  __typename: 'Member_Atlassian_Organization';
  id: Scalars['ID'];
  idEnterprise: Scalars['ID'];
  name: Scalars['String'];
  domains: Array<Scalars['String']>;
  linked: Scalars['Boolean'];
  isIdentityAdmin: Scalars['Boolean'];
  ssoUrl: Scalars['String'];
};

/** The source of an avatar */
export const Member_AvatarSource = {
  /** No avatar */
  None: 'none',
  /** The avatar is hosted by gravatar */
  Gravatar: 'gravatar',
  /** The avatar has been uploaded */
  Upload: 'upload'
} as const;

export type Member_AvatarSource = typeof Member_AvatarSource[keyof typeof Member_AvatarSource];
/** Banners that a member may be able to interact with */
export type Member_Banner = {
  __typename: 'Member_Banner';
  id: Scalars['String'];
  message: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  dismissible: Scalars['Boolean'];
  meta?: Maybe<Member_BannerMeta>;
};

export type Member_BannerMeta = {
  __typename: 'Member_BannerMeta';
  totalMembersInDomain?: Maybe<Scalars['Int']>;
  totalWorkspacesInDomain?: Maybe<Scalars['Int']>;
};

/** An Enterprise license granted to a Member */
export type Member_EnterpriseLicense = {
  __typename: 'Member_EnterpriseLicense';
  /** The ID of the Enterprise that the license is for */
  idEnterprise: Scalars['ID'];
  /** The type of license granted */
  type: Member_EnterpriseLicenseType;
};

/** A type of Enterprise license */
export const Member_EnterpriseLicenseType = {
  /** The standard enterprise license, designating a paid member of the enterprise */
  Team: 'team',
  /** A user who is a member of an Enterprise board, but has not previously been granted a 'team' license */
  Collaborator: 'collaborator'
} as const;

export type Member_EnterpriseLicenseType = typeof Member_EnterpriseLicenseType[keyof typeof Member_EnterpriseLicenseType];
/** A filter for the Members being requested */
export const Member_Filter = {
  /** Normal members of the Organization or Board */
  Normal: 'normal',
  /** Admin members of the Organization or Board */
  Admins: 'admins'
} as const;

export type Member_Filter = typeof Member_Filter[keyof typeof Member_Filter];
/** The limits on the Member */
export type Member_Limits = {
  __typename: 'Member_Limits';
  /** The member-board limits */
  boards: Member_Limits_Boards;
  /** The member-organization limits */
  orgs: Member_Limits_Orgs;
};

/** The member-board limits */
export type Member_Limits_Boards = {
  __typename: 'Member_Limits_Boards';
  /** The limit for the total boards per member */
  totalPerMember: Limit;
};

/** The member-organization limits */
export type Member_Limits_Orgs = {
  __typename: 'Member_Limits_Orgs';
  /** The limit for the total organizations per member */
  totalPerMember: Limit;
};

/** The types of logins a user can use */
export const Member_LoginType = {
  Android: 'android',
  Atlassian: 'atlassian',
  Google: 'google',
  Password: 'password',
  Saml: 'saml'
} as const;

export type Member_LoginType = typeof Member_LoginType[keyof typeof Member_LoginType];
/** Information about if/when the Member has opted in/out of marketing communication */
export type Member_MarketingOptIn = {
  __typename: 'Member_MarketingOptIn';
  /** Whether the Member is opted in to marketing communication */
  optedIn: Scalars['Boolean'];
  /** When the Member last opted in/out of marketing communication */
  date: Scalars['String'];
};

/**
 * Whether the member is a registered Trello user or a 'ghost' user
 * created by an email invite
 */
export const Member_MemberType = {
  Ghost: 'ghost',
  Normal: 'normal'
} as const;

export type Member_MemberType = typeof Member_MemberType[keyof typeof Member_MemberType];
/** Information about in-app messages that the Member has dismissed */
export type Member_MessageDismissed = {
  __typename: 'Member_MessageDismissed';
  /** The ID of the MessageDismissed record (not the id of the message itself) */
  id: Scalars['ID'];
  /** The name of the message dismissed */
  name: Scalars['String'];
  /** The number of times the message has been dismissed */
  count: Scalars['Int'];
  /** The date the message was last dismissed */
  lastDismissed: Scalars['String'];
};

/** The information the Member has chosen to be non-public */
export type Member_NonPublic = {
  __typename: 'Member_NonPublic';
  /** The URL of the current avatar being used, regardless of whether it is a gravatar or uploaded avatar. */
  avatarUrl?: Maybe<Scalars['String']>;
  /** The member's initials, used for display when there isn't an avatar set. */
  initials?: Maybe<Scalars['String']>;
  /** The full display name for the member. */
  fullName?: Maybe<Scalars['String']>;
};

/** The preferences for a Member */
export type Member_Prefs = {
  __typename: 'Member_Prefs';
  /** How often the user should receive email summaries */
  minutesBetweenSummaries: Scalars['Int'];
  /** The default minutes before a due date to send a notification */
  minutesBeforeDeadlineToNotify: Scalars['Int'];
  /** Whether the user has enabled color blind mode */
  colorBlind: Scalars['Boolean'];
  /** The user's locale preference */
  locale: Scalars['String'];
  /** The users timezone preference */
  timezoneInfo: Member_Prefs_TimezoneInfo;
  /** The users twoFactor authentication info */
  twoFactor?: Maybe<Member_Prefs_TwoFactor>;
  /** Privacy settings for a user's details */
  privacy: Member_Prefs_Privacy;
};

/** Privacy settings for a user's details */
export type Member_Prefs_Privacy = {
  __typename: 'Member_Prefs_Privacy';
  /** Privacy setting for displaying the user's full name */
  fullName: Member_Prefs_PrivacyOption;
  /** Privacy setting for displaying the user's avatar */
  avatar: Member_Prefs_PrivacyOption;
};

/** The visibility of a user detail */
export const Member_Prefs_PrivacyOption = {
  /** Visible to everyone */
  Public: 'public',
  /** Not visible to anyone */
  Private: 'private',
  /** Visible to collaborators only */
  Collaborator: 'collaborator'
} as const;

export type Member_Prefs_PrivacyOption = typeof Member_Prefs_PrivacyOption[keyof typeof Member_Prefs_PrivacyOption];
/** Information about a user's Timezone */
export type Member_Prefs_TimezoneInfo = {
  __typename: 'Member_Prefs_TimezoneInfo';
  timezoneNext: Scalars['String'];
  dateNext: Scalars['String'];
  offsetNext: Scalars['Int'];
  timezoneCurrent: Scalars['String'];
  offsetCurrent: Scalars['Int'];
};

/** Information about a user's 2-factor authentication */
export type Member_Prefs_TwoFactor = {
  __typename: 'Member_Prefs_TwoFactor';
  /** Whether 2-factor-auth is enabled for the user */
  enabled: Scalars['Boolean'];
  /** Whether new backup codes are needed for the user */
  needsNewBackups: Scalars['Boolean'];
};

/** Fields to monitor migrating all boards of a member into a team. */
export type Member_Teamify = {
  __typename: 'Member_Teamify';
  /** Whether migration has started, is running, or has finished */
  state: Member_Teamify_State;
  /** The date when auto-migration will run for this user */
  autoMigration?: Maybe<Scalars['String']>;
  /** Whether a user will be very impacted, not impacted at all, or minorly impacted by the migration */
  impact?: Maybe<Member_Teamify_Impact>;
  /** The id of the new team created to house all boards in the automatic migration */
  idOrgCreated?: Maybe<Scalars['String']>;
  /** The id of the existing team selected to house all boards in the automatic migration */
  idOrgSelected?: Maybe<Scalars['String']>;
  /** Whether we added a free trial of BC to the team above */
  createdOrgHasBcTrial?: Maybe<Scalars['Boolean']>;
  /** Number of solo teamless boards for a member */
  soloTeamlessBoards: Scalars['Int'];
  /** Number of collaborative teamless boards for a member */
  collaborativeTeamlessBoards: Scalars['Int'];
  /** Whether the user is in an org with at least one other user */
  inCollaborativeOrg?: Maybe<Scalars['Boolean']>;
  /** Whether the user has gone through voluntary migration at least once */
  voluntaryDone?: Maybe<Scalars['String']>;
};

export const Member_Teamify_Impact = {
  /** User will not be disrupted by automatic migration of boards into teams */
  None: 'none',
  /** User is unlikely to be disrupted by us migrating their boards automatically */
  Low: 'low',
  /** User is likely to be disrupted by us migrating their boards automatically */
  High: 'high'
} as const;

export type Member_Teamify_Impact = typeof Member_Teamify_Impact[keyof typeof Member_Teamify_Impact];
export const Member_Teamify_State = {
  /** Migration has not started */
  Nope: 'nope',
  /** Migration has started but has not finished */
  Pending: 'pending',
  /** Migration has finished */
  Done: 'done'
} as const;

export type Member_Teamify_State = typeof Member_Teamify_State[keyof typeof Member_Teamify_State];
/** Counts of various membership types on the Board */
export type MembershipCounts = {
  __typename: 'MembershipCounts';
  /** 0 or 1 indicating whether you are a Member of the Board */
  me?: Maybe<Scalars['Int']>;
  /** The count of normal Members on the Board */
  normal?: Maybe<Scalars['Int']>;
  /** The count of admin Members on the Board */
  admin?: Maybe<Scalars['Int']>;
  /** The count of active Members on the Board */
  active?: Maybe<Scalars['Int']>;
  /** The count of deactivated Members on the Board */
  deactivated?: Maybe<Scalars['Int']>;
};

/** Filters for only certain counts to be aggregated on MembershipCounts */
export const MembershipCounts_Filter = {
  Me: 'me',
  Normal: 'normal',
  Admin: 'admin',
  Active: 'active',
  Deactivated: 'deactivated'
} as const;

export type MembershipCounts_Filter = typeof MembershipCounts_Filter[keyof typeof MembershipCounts_Filter];
/** Information on whether an entity is a member or organization, and its corresponding ID. */
export type ModelType = {
  __typename: 'ModelType';
  type: Scalars['String'];
  id: Scalars['ID'];
};

export type Mutation = {
  __typename: 'Mutation';
  /** Adds board star to the user */
  addBoardStar?: Maybe<BoardStar>;
  /** Remove board star from the user */
  removeBoardStar?: Maybe<Scalars['Boolean']>;
  /** Adds free trial to an organization */
  addFreeTrial?: Maybe<Organization>;
  /** Applies 3 month bc discount to an organization */
  applyBCDiscount?: Maybe<Scalars['Boolean']>;
  /** Adds a message to oneTimeMessagesDismissed */
  addOneTimeMessagesDismissed?: Maybe<Member>;
  /** Adds a tag for the organization */
  addTag?: Maybe<Scalars['Boolean']>;
  /** Adds Members to Organization */
  addMembersToOrg?: Maybe<InviteMember_Response>;
  /** Removes Members from a Workspace */
  removeMembersFromWorkspace?: Maybe<RemoveMembersFromWorkspace_Response>;
  /** Creates an organization */
  createOrganization?: Maybe<Organization>;
  /** Update the locale of the user */
  updateUserLocale?: Maybe<Member>;
  /** Set the teamifyVoluntaryDone field */
  updateTeamifyVoluntaryDone?: Maybe<Member>;
  /** Set an Atlassian Account login ID as the primary login, and delete all other logins */
  prepMemberForAtlassianAccountOnboarding?: Maybe<Member>;
  /** Set one login ID as the primary login, and delete all other logins */
  prepMemberForEmailHygiene?: Maybe<Member>;
  /** Internal endpoint for development and trelloinc members */
  deleteOneTimeMessagesDismissed?: Maybe<Member>;
  /** Dismisses an Announcement */
  dismissAnnouncement?: Maybe<Announcement_DismissResponse>;
  /** Add a CheckItem to a checklist on a Card */
  addCheckItem?: Maybe<CheckItem>;
  /** Add a Checklist to a Card */
  addChecklist?: Maybe<Checklist>;
  /** Delete a CheckItem from a Checklist on a Card */
  deleteCheckItem?: Maybe<CheckItem_DeleteResponse>;
  /** Deletes the logo for the organization */
  deleteOrganizationLogo?: Maybe<Organization>;
  /** Delete a Checklist from a Card */
  deleteChecklist?: Maybe<Checklist_DeleteResponse>;
  /** Adds a campaign */
  addCampaign?: Maybe<Campaign>;
  /** Updates a campaign */
  updateCampaign?: Maybe<Campaign>;
  /** Updates a board's org. If no boardId is given, the board becomes a personal board. */
  updateBoardOrg?: Maybe<Board>;
  /** Updates a collection of board's org */
  updateBoardsOrg: Array<Maybe<Board>>;
  /** Updates a board's visibility. If an orgId is given, the board is also moved into the org. */
  updateBoardVisibility?: Maybe<Board>;
  /** Updates a board's card covers preference */
  updateBoardCardCoversPref?: Maybe<Board>;
  /** Update the due date of a CheckItem */
  updateCheckItemDueDate?: Maybe<CheckItem>;
  /** Update the name of a CheckItem */
  updateCheckItemName?: Maybe<CheckItem>;
  /** Update the vertical position of a CheckItem in its Checklist */
  updateCheckItemPos?: Maybe<CheckItem>;
  /** Update the 'checked' state of a CheckItem */
  updateCheckItemState?: Maybe<CheckItem>;
  /** Update the 'calendarFeedEnabled' state of the board */
  updateCalendarFeedEnabledPref?: Maybe<Board>;
  /** Generate a new calendarKey for the board */
  updateCalendarKey?: Maybe<Board>;
  /** Update the name of a Checklist */
  updateChecklistName?: Maybe<Checklist>;
  /** Update the position of a Checklist */
  updateChecklistPos?: Maybe<Checklist>;
  /** Updates the profile of the organization */
  updateOrganization?: Maybe<Organization>;
  /** Enable a Plugin on a Board */
  enablePlugin?: Maybe<Plugin_EnableResponse>;
  /** Update a Plugin */
  updatePlugin?: Maybe<Plugin>;
  /** Copies a board to an organization's workspace */
  copyBoardToOrg?: Maybe<Board>;
  /** Create a Plugin */
  createPlugin?: Maybe<Plugin>;
  /** Delete a Plugin */
  deletePlugin?: Maybe<Plugin_DeleteResponse>;
  /** Create a Plugin listing */
  createPluginListing?: Maybe<Plugin_Listing>;
  /** Update a Plugin's listing */
  updatePluginListing?: Maybe<Plugin_Listing>;
  /** Delete a Plugin's listing */
  deletePluginListing?: Maybe<Plugin_Listing_DeleteResponse>;
  /** Add a member to a Plugin's collaborators */
  addPluginCollaborator?: Maybe<Plugin_Collaborators_UpdateResponse>;
  /** Remove a member from a Plugin's collaborators */
  removePluginCollaborator?: Maybe<Plugin_Collaborators_UpdateResponse>;
  /** Create an Agreement for developer terms */
  acceptDeveloperTerms?: Maybe<Member_Agreement>;
  /** Upload a organization profile image */
  uploadOrganizationImage?: Maybe<Organization>;
  /** Update a member's avatar source */
  updateMemberAvatarSource?: Maybe<Member>;
  /** Upload a new avatar */
  uploadMemberAvatar?: Maybe<Member>;
  /** Upload a card cover */
  uploadCardCover?: Maybe<Attachment>;
  /** Update a card dueComplete */
  updateCardDueComplete?: Maybe<Card>;
  /** Update a card cover */
  updateCardCover?: Maybe<Card>;
  /** Changes the current member's primary email */
  changeMemberEmail?: Maybe<Member>;
  /** Updates the member's active channel */
  updateMemberActiveChannel?: Maybe<Member>;
  /** Resend verification email */
  resendVerificationEmail?: Maybe<Member>;
  /** Create a new list in a board */
  createList?: Maybe<List>;
  /** Create a new template card */
  createCardTemplate?: Maybe<Card>;
  /** Create a new card */
  createCard?: Maybe<Card>;
  /** Copies a card */
  copyCard?: Maybe<Card>;
  /** Archives a card */
  archiveCard?: Maybe<Card>;
  /** Unarchives a card */
  unarchiveCard?: Maybe<Card>;
  /** Delete a card */
  deleteCard?: Maybe<Card_DeleteResponse>;
  /** Change a card's name */
  updateCardName?: Maybe<Card>;
  /** Change a card's list */
  updateCardList?: Maybe<Card>;
  /** Change card due date */
  changeCardDueDate?: Maybe<Card>;
  /** Update card start and due date */
  updateCardDates?: Maybe<Card>;
  /** Start board export */
  startBoardExport?: Maybe<Export>;
  /** Put a team under an Enterprise's ownership */
  claimOrganization: Organization;
  /** Create a new Custom Field */
  createCustomField?: Maybe<CustomField>;
  /** Sign up for Trello Business Class or Trello Standard */
  createWorkspacePaidAccount?: Maybe<Organization>;
  /** Sign up for Trello Gold */
  createGoldPaidAccount?: Maybe<Member>;
  /** Activate Gold from Credit */
  activateGoldCredit?: Maybe<Member>;
  /** Reactivate a canceled Business Class or Standard paid account */
  reactivateWorkspacePaidAccount: Organization;
  /** Reactivate a canceled Gold paid account */
  reactivateGoldPaidAccount: Member;
  /** Update the Credit Card on file for a Business Class paid account */
  updateBusinessClassCreditCard: Organization;
  /** Update the Credit Card on file for a Gold paid account */
  updateGoldCreditCard: Member;
  /** Update product associated with a Business Class paid account */
  updateBusinessClassPaidProduct: Organization;
  /** Update product associated with a Gold paid account */
  updateGoldPaidProduct: Member;
  /** Update invoice details for a Business Class paid account */
  updateBusinessClassBillingContactDetails: Organization;
  /** Update invoice details for a Gold paid account */
  updateGoldBillingContactDetails: Member;
  /** Update invoice details for a Business Class paid account */
  updateBusinessClassBillingInvoiceDetails: Organization;
  /** Update invoice details for a Gold paid account */
  updateGoldBillingInvoiceDetails: Member;
  /** Cancel a Workspace paid account */
  cancelWorkspacePaidAccount: Organization;
  /** Cancel a Gold paid account */
  cancelGoldPaidAccount: Member;
  /** Link an Enterprise to an Atlassian organization */
  linkEnterpriseWithAtlassianOrganization?: Maybe<Enterprise_LinkAtlassianOrganizationResponse>;
  /** Delete all consent tokens issued by a single managed member of the enterprise */
  deleteManagedMemberTokens: Enterprise_DeleteManagedMemberTokensResponse;
  /** Delete all consent tokens issued by all managed members of the enterprise */
  deleteAllManagedMemberTokens: Enterprise_DeleteAllManagedMemberTokensResponse;
  /** Update the setting that determines whether or not managed members can issue consent tokens to third-party apps */
  updateEnterpriseApiTokenCreationPermission?: Maybe<Enterprise>;
  createDashboardViewTile: Board_DashboardViewTile;
  updateDashboardViewTile: Board_DashboardViewTile;
  /** Delete a Tile from a Board's dashboardViewTiles */
  deleteDashboardViewTile?: Maybe<Scalars['Boolean']>;
  /** Update the role of a card (board, separator, regular) */
  updateCardRole: Card;
  /** Add a Butler button */
  addButlerButton?: Maybe<ButlerButton>;
  /** Add a new organization view */
  createOrganizationView?: Maybe<OrganizationView>;
  /** Update an organization view */
  updateOrganizationView?: Maybe<OrganizationView>;
  /** Update a single view within an organizationView */
  updateViewInOrganizationView?: Maybe<OrganizationView>;
  /** Mark notifications as read/unread by the list of ids */
  setNotificationsRead?: Maybe<Notifications_ReadResponse>;
  /** Mark all notifications as read */
  setAllNotificationsRead?: Maybe<Notifications_ReadResponse>;
  /** Delete a Butler Button */
  deleteButlerButton?: Maybe<Scalars['Boolean']>;
  /** Sent board access request */
  sendBoardAccessRequest?: Maybe<BoardAccessRequest_Response>;
};


export type MutationAddBoardStarArgs = {
  memberId: Scalars['ID'];
  boardId: Scalars['ID'];
  pos: Scalars['Int'];
};


export type MutationRemoveBoardStarArgs = {
  memberId: Scalars['ID'];
  boardStarId: Scalars['ID'];
};


export type MutationAddFreeTrialArgs = {
  orgId: Scalars['ID'];
  via?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
};


export type MutationApplyBcDiscountArgs = {
  orgId: Scalars['ID'];
};


export type MutationAddOneTimeMessagesDismissedArgs = {
  memberId: Scalars['ID'];
  messageId: Scalars['ID'];
};


export type MutationAddTagArgs = {
  orgId: Scalars['ID'];
  tag: Scalars['String'];
};


export type MutationAddMembersToOrgArgs = {
  orgId: Scalars['ID'];
  users: Array<Maybe<MemberOrEmail>>;
  invitationMessage: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};


export type MutationRemoveMembersFromWorkspaceArgs = {
  orgId: Scalars['ID'];
  users: Array<Maybe<MemberOrEmail>>;
  type?: Maybe<Scalars['String']>;
};


export type MutationCreateOrganizationArgs = {
  displayName: Scalars['String'];
  type: Scalars['String'];
  teamType?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  enterprise?: Maybe<Scalars['String']>;
  creationMethod?: Maybe<Scalars['String']>;
  traceId?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserLocaleArgs = {
  memberId: Scalars['ID'];
  locale: Scalars['String'];
};


export type MutationUpdateTeamifyVoluntaryDoneArgs = {
  memberId: Scalars['ID'];
};


export type MutationPrepMemberForAtlassianAccountOnboardingArgs = {
  memberId: Scalars['ID'];
  aaLoginId: Scalars['ID'];
  nonAaLoginIds: Array<Scalars['ID']>;
};


export type MutationPrepMemberForEmailHygieneArgs = {
  memberId: Scalars['ID'];
  primaryLoginId: Scalars['ID'];
  removeLoginIds: Array<Scalars['ID']>;
  dismissMessage?: Maybe<Scalars['String']>;
};


export type MutationDeleteOneTimeMessagesDismissedArgs = {
  memberId: Scalars['ID'];
  message: Scalars['String'];
};


export type MutationDismissAnnouncementArgs = {
  announcementId: Scalars['ID'];
};


export type MutationAddCheckItemArgs = {
  cardId: Scalars['ID'];
  checklistId?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  temporaryId: Scalars['String'];
};


export type MutationAddChecklistArgs = {
  boardId: Scalars['ID'];
  cardId: Scalars['ID'];
  checklistSourceId?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  temporaryId: Scalars['String'];
};


export type MutationDeleteCheckItemArgs = {
  cardId: Scalars['ID'];
  checklistId: Scalars['ID'];
  checkItemId: Scalars['ID'];
};


export type MutationDeleteOrganizationLogoArgs = {
  orgId: Scalars['ID'];
};


export type MutationDeleteChecklistArgs = {
  checklistId: Scalars['ID'];
};


export type MutationAddCampaignArgs = {
  name: Scalars['String'];
  currentStep: Scalars['String'];
};


export type MutationUpdateCampaignArgs = {
  campaignId: Scalars['ID'];
  currentStep?: Maybe<Scalars['String']>;
  dateDismissed?: Maybe<Scalars['String']>;
  isDismissed?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateBoardOrgArgs = {
  boardId: Scalars['ID'];
  orgId?: Maybe<Scalars['ID']>;
  keepBillableGuests?: Maybe<Scalars['Boolean']>;
  traceId?: Maybe<Scalars['String']>;
};


export type MutationUpdateBoardsOrgArgs = {
  boardIds: Array<Maybe<Scalars['ID']>>;
  orgId?: Maybe<Scalars['ID']>;
  keepBillableGuests?: Maybe<Scalars['Boolean']>;
  staggerRequests?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateBoardVisibilityArgs = {
  boardId: Scalars['ID'];
  visibility: Board_Prefs_PermissionLevel;
  orgId?: Maybe<Scalars['ID']>;
  keepBillableGuests?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateBoardCardCoversPrefArgs = {
  boardId: Scalars['ID'];
  cardCovers: Scalars['Boolean'];
};


export type MutationUpdateCheckItemDueDateArgs = {
  cardId: Scalars['ID'];
  checklistId: Scalars['ID'];
  checkItemId: Scalars['ID'];
  due: Scalars['String'];
};


export type MutationUpdateCheckItemNameArgs = {
  cardId: Scalars['ID'];
  checklistId: Scalars['ID'];
  checkItemId: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateCheckItemPosArgs = {
  cardId: Scalars['ID'];
  checklistId: Scalars['ID'];
  checkItemId: Scalars['ID'];
  pos: Scalars['Float'];
};


export type MutationUpdateCheckItemStateArgs = {
  cardId: Scalars['ID'];
  checklistId: Scalars['ID'];
  checkItemId: Scalars['ID'];
  state: CheckItem_State;
  traceId: Scalars['String'];
};


export type MutationUpdateCalendarFeedEnabledPrefArgs = {
  boardId: Scalars['ID'];
  calendarFeedEnabled: Scalars['Boolean'];
};


export type MutationUpdateCalendarKeyArgs = {
  boardId: Scalars['ID'];
};


export type MutationUpdateChecklistNameArgs = {
  checklistId: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateChecklistPosArgs = {
  checklistId: Scalars['ID'];
  pos: Scalars['Float'];
};


export type MutationUpdateOrganizationArgs = {
  orgId: Scalars['ID'];
  displayName: Scalars['String'];
  name: Scalars['String'];
  teamType?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};


export type MutationEnablePluginArgs = {
  boardId: Scalars['ID'];
  pluginId: Scalars['ID'];
  traceId: Scalars['String'];
};


export type MutationUpdatePluginArgs = {
  pluginId: Scalars['ID'];
  fields?: Maybe<UpdatePluginFields>;
};


export type MutationCopyBoardToOrgArgs = {
  organizationId: Scalars['ID'];
  boardId: Scalars['ID'];
};


export type MutationCreatePluginArgs = {
  organizationId: Scalars['ID'];
  agreementId: Scalars['ID'];
  listings: Array<InputPluginListing>;
  iframeConnectorUrl: Scalars['String'];
  author?: Maybe<Scalars['String']>;
};


export type MutationDeletePluginArgs = {
  pluginId: Scalars['ID'];
};


export type MutationCreatePluginListingArgs = {
  pluginId: Scalars['ID'];
  locale: Scalars['String'];
  name: Scalars['String'];
  overview: Scalars['String'];
  description: Scalars['String'];
};


export type MutationUpdatePluginListingArgs = {
  pluginId: Scalars['ID'];
  pluginListingId: Scalars['ID'];
  locale?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  overview?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};


export type MutationDeletePluginListingArgs = {
  pluginId: Scalars['ID'];
  pluginListingId: Scalars['ID'];
};


export type MutationAddPluginCollaboratorArgs = {
  pluginId: Scalars['ID'];
  memberId: Scalars['ID'];
};


export type MutationRemovePluginCollaboratorArgs = {
  pluginId: Scalars['ID'];
  memberId: Scalars['ID'];
};


export type MutationAcceptDeveloperTermsArgs = {
  memberId: Scalars['ID'];
};


export type MutationUploadOrganizationImageArgs = {
  orgId: Scalars['ID'];
  file: Scalars['FileUpload'];
};


export type MutationUpdateMemberAvatarSourceArgs = {
  avatarSource: Member_AvatarSource;
};


export type MutationUploadMemberAvatarArgs = {
  file: Scalars['FileUpload'];
  uploadProgressCallback?: Maybe<Scalars['FileUploadProgressCallback']>;
};


export type MutationUploadCardCoverArgs = {
  cardId: Scalars['ID'];
  file: Scalars['FileUpload'];
  traceId: Scalars['String'];
};


export type MutationUpdateCardDueCompleteArgs = {
  cardId: Scalars['ID'];
  dueComplete: Scalars['Boolean'];
  traceId: Scalars['String'];
};


export type MutationUpdateCardCoverArgs = {
  cardId: Scalars['ID'];
  cover?: Maybe<InputCover>;
  traceId: Scalars['String'];
};


export type MutationChangeMemberEmailArgs = {
  email: Scalars['String'];
  loginId: Scalars['ID'];
  primary?: Maybe<Scalars['Boolean']>;
  dismissMessage?: Maybe<Scalars['String']>;
};


export type MutationUpdateMemberActiveChannelArgs = {
  memberId: Scalars['ID'];
  channel: Scalars['String'];
};


export type MutationResendVerificationEmailArgs = {
  email: Scalars['String'];
};


export type MutationCreateListArgs = {
  idBoard: Scalars['ID'];
  name: Scalars['String'];
  pos?: Maybe<Scalars['Float']>;
  traceId: Scalars['String'];
};


export type MutationCreateCardTemplateArgs = {
  listId: Scalars['ID'];
  name: Scalars['String'];
  closed?: Maybe<Scalars['Boolean']>;
  traceId: Scalars['String'];
};


export type MutationCreateCardArgs = {
  idList: Scalars['ID'];
  name: Scalars['String'];
  closed?: Maybe<Scalars['Boolean']>;
  idLabels?: Maybe<Array<Scalars['ID']>>;
  idMembers?: Maybe<Array<Scalars['ID']>>;
  start?: Maybe<Scalars['String']>;
  due?: Maybe<Scalars['String']>;
  traceId: Scalars['String'];
};


export type MutationCopyCardArgs = {
  idCardSource: Scalars['ID'];
  idList: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  keepFromSource?: Maybe<Array<Scalars['String']>>;
  traceId: Scalars['String'];
};


export type MutationArchiveCardArgs = {
  idCard: Scalars['ID'];
};


export type MutationUnarchiveCardArgs = {
  idCard: Scalars['ID'];
};


export type MutationDeleteCardArgs = {
  idCard: Scalars['ID'];
};


export type MutationUpdateCardNameArgs = {
  idCard: Scalars['ID'];
  name: Scalars['String'];
  traceId: Scalars['String'];
};


export type MutationUpdateCardListArgs = {
  idCard: Scalars['ID'];
  idList: Scalars['ID'];
  traceId?: Maybe<Scalars['String']>;
};


export type MutationChangeCardDueDateArgs = {
  idCard: Scalars['ID'];
  due?: Maybe<Scalars['String']>;
  dueReminder?: Maybe<Scalars['String']>;
  traceId?: Maybe<Scalars['String']>;
};


export type MutationUpdateCardDatesArgs = {
  idCard: Scalars['ID'];
  due?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
  dueReminder?: Maybe<Scalars['String']>;
  traceId?: Maybe<Scalars['String']>;
};


export type MutationStartBoardExportArgs = {
  id: Scalars['ID'];
};


export type MutationClaimOrganizationArgs = {
  idEnterprise: Scalars['ID'];
  idOrganization: Scalars['ID'];
};


export type MutationCreateCustomFieldArgs = {
  name: Scalars['String'];
  idModel: Scalars['String'];
  modelType: Scalars['String'];
  display: CreateCustomField_Display;
  type: Scalars['String'];
  options?: Maybe<Array<CreateCustomField_Option>>;
};


export type MutationCreateWorkspacePaidAccountArgs = {
  idOrganization: Scalars['ID'];
  products: Array<Scalars['Int']>;
  nonce: Scalars['String'];
  country: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  acceptTOS: Scalars['Boolean'];
  name: Scalars['String'];
  email: Scalars['String'];
  locale: Scalars['String'];
  freeTrial?: Maybe<Scalars['Boolean']>;
  discountCode?: Maybe<Scalars['String']>;
  traceId: Scalars['String'];
};


export type MutationCreateGoldPaidAccountArgs = {
  idMember: Scalars['ID'];
  products: Array<Scalars['Int']>;
  nonce: Scalars['String'];
  country: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  acceptTOS: Scalars['Boolean'];
  name: Scalars['String'];
  email: Scalars['String'];
  locale: Scalars['String'];
  traceId: Scalars['String'];
};


export type MutationActivateGoldCreditArgs = {
  idMember: Scalars['ID'];
  products: Array<Scalars['Int']>;
};


export type MutationReactivateWorkspacePaidAccountArgs = {
  idOrganization: Scalars['ID'];
  products: Array<Scalars['Int']>;
  nonce: Scalars['String'];
  country: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  acceptTOS: Scalars['Boolean'];
  name: Scalars['String'];
  email: Scalars['String'];
  locale: Scalars['String'];
  discountCode?: Maybe<Scalars['String']>;
  traceId: Scalars['String'];
};


export type MutationReactivateGoldPaidAccountArgs = {
  idMember: Scalars['ID'];
  product: Scalars['Int'];
  traceId: Scalars['String'];
};


export type MutationUpdateBusinessClassCreditCardArgs = {
  accountId: Scalars['ID'];
  nonce: Scalars['String'];
  country: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
};


export type MutationUpdateGoldCreditCardArgs = {
  accountId: Scalars['ID'];
  nonce: Scalars['String'];
  country: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
};


export type MutationUpdateBusinessClassPaidProductArgs = {
  accountId: Scalars['ID'];
  products: Array<Scalars['Int']>;
};


export type MutationUpdateGoldPaidProductArgs = {
  accountId: Scalars['ID'];
  products: Array<Scalars['Int']>;
};


export type MutationUpdateBusinessClassBillingContactDetailsArgs = {
  accountId: Scalars['ID'];
  contactName: Scalars['String'];
  contactEmail: Scalars['String'];
  contactLocale: Scalars['String'];
};


export type MutationUpdateGoldBillingContactDetailsArgs = {
  accountId: Scalars['ID'];
  contactName: Scalars['String'];
  contactEmail: Scalars['String'];
  contactLocale: Scalars['String'];
};


export type MutationUpdateBusinessClassBillingInvoiceDetailsArgs = {
  accountId: Scalars['ID'];
  invoiceDetails: Scalars['String'];
};


export type MutationUpdateGoldBillingInvoiceDetailsArgs = {
  accountId: Scalars['ID'];
  invoiceDetails: Scalars['String'];
};


export type MutationCancelWorkspacePaidAccountArgs = {
  accountId: Scalars['ID'];
};


export type MutationCancelGoldPaidAccountArgs = {
  accountId: Scalars['ID'];
};


export type MutationLinkEnterpriseWithAtlassianOrganizationArgs = {
  idEnterprise: Scalars['ID'];
  atlOrgId: Scalars['ID'];
};


export type MutationDeleteManagedMemberTokensArgs = {
  idEnterprise: Scalars['ID'];
  idMember: Scalars['ID'];
  filter?: Maybe<Scalars['String']>;
};


export type MutationDeleteAllManagedMemberTokensArgs = {
  idEnterprise: Scalars['ID'];
  filter?: Maybe<Scalars['String']>;
};


export type MutationUpdateEnterpriseApiTokenCreationPermissionArgs = {
  idEnterprise: Scalars['ID'];
  isAllowed: Scalars['Boolean'];
};


export type MutationCreateDashboardViewTileArgs = {
  idBoard: Scalars['ID'];
  tile: CreateDashboardViewTile;
};


export type MutationUpdateDashboardViewTileArgs = {
  idBoard: Scalars['ID'];
  tile: UpdateDashboardViewTile;
};


export type MutationDeleteDashboardViewTileArgs = {
  idBoard: Scalars['ID'];
  idTile: Scalars['ID'];
};


export type MutationUpdateCardRoleArgs = {
  idCard: Scalars['ID'];
  cardRole?: Maybe<CardRole>;
};


export type MutationAddButlerButtonArgs = {
  scope: Scalars['String'];
  idScope: Scalars['ID'];
  butlerButton: InputButlerButton;
};


export type MutationCreateOrganizationViewArgs = {
  name: Scalars['String'];
  idOrganization: Scalars['ID'];
  views?: Maybe<Array<Maybe<InputOrganizationView_View>>>;
  prefs: InputOrganizationView_Prefs;
};


export type MutationUpdateOrganizationViewArgs = {
  idOrganizationView: Scalars['ID'];
  organizationView: InputOrganizationView;
};


export type MutationUpdateViewInOrganizationViewArgs = {
  idOrganizationView: Scalars['ID'];
  idView: Scalars['ID'];
  view: InputOrganizationView_View;
};


export type MutationSetNotificationsReadArgs = {
  read: Scalars['Boolean'];
  ids: Array<Scalars['String']>;
};


export type MutationDeleteButlerButtonArgs = {
  idButton: Scalars['ID'];
  idBoard: Scalars['ID'];
  idOrganization: Scalars['ID'];
  scope: Scalars['String'];
};


export type MutationSendBoardAccessRequestArgs = {
  modelType: RequestAccessModelType;
  id: Scalars['ID'];
};

/** The Board preferences specific to the current Member */
export type MyPrefs = {
  __typename: 'MyPrefs';
  /** Allows for generating a calendar from url */
  calendarKey: Scalars['String'];
  /** Whether the sidebar should be shown */
  showSidebar: Scalars['Boolean'];
  /** The generated key used in the email address for the Board */
  emailKey?: Maybe<Scalars['String']>;
  /** The id of the List to add cards to when the Board is emailed */
  idEmailList?: Maybe<Scalars['String']>;
  /** The position in the List to add cards to when the Board is emailed */
  emailPosition?: Maybe<MyPrefs_EmailPosition>;
};

/** The position in the List to add cards to when the Board is emailed */
export const MyPrefs_EmailPosition = {
  /** The top of the List */
  Top: 'top',
  /** The bottom of the List */
  Bottom: 'bottom'
} as const;

export type MyPrefs_EmailPosition = typeof MyPrefs_EmailPosition[keyof typeof MyPrefs_EmailPosition];
export type Notification = {
  __typename: 'Notification';
  id: Scalars['String'];
  appCreator?: Maybe<AppCreator>;
  type: Scalars['String'];
  date: Scalars['String'];
  data?: Maybe<NotificationData>;
  display?: Maybe<NotificationDisplay>;
  idMemberCreator: Scalars['String'];
  idAction: Scalars['String'];
  isReactable?: Maybe<Scalars['Boolean']>;
  unread?: Maybe<Scalars['Boolean']>;
  dateRead?: Maybe<Scalars['String']>;
  reactions: Array<Reaction>;
  memberCreator: Member;
};

export type NotificationData = {
  __typename: 'NotificationData';
  board?: Maybe<BoardNotificationData>;
  card?: Maybe<CardNotificationData>;
  text?: Maybe<Scalars['String']>;
};

export type NotificationDisplay = {
  __typename: 'NotificationDisplay';
  entities?: Maybe<NotificationDisplayEntity>;
  translationKey?: Maybe<Scalars['String']>;
};

export type NotificationDisplayEntity = {
  __typename: 'NotificationDisplayEntity';
  board?: Maybe<BoardEntity>;
  card?: Maybe<CardEntity>;
  due?: Maybe<DueEntity>;
  memberCreator?: Maybe<MemberEntity>;
};

export type NotificationGroup = {
  __typename: 'NotificationGroup';
  id: Scalars['String'];
  notifications: Array<Notification>;
  card?: Maybe<Card>;
};

/** An object representing the response from the setNotificationsRead and setAllNotificationsRead mutations */
export type Notifications_ReadResponse = {
  __typename: 'Notifications_ReadResponse';
  /** Whether marking as read was successful */
  success: Scalars['Boolean'];
};

/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type Organization = {
  __typename: 'Organization';
  /** The boards belonging to the Organization that are visible to the user */
  boards: Array<Board>;
  /** The Enterprise this Organization belongs to */
  enterprise?: Maybe<Enterprise>;
  /** The Members in the Organization */
  members: Array<Member>;
  /** Information about the paid account of an organization */
  paidAccount?: Maybe<PaidAccount>;
  /** The Plugins associated with this Organization */
  plugins: Array<Plugin>;
  /** The PluginData for this Organization */
  pluginData: Array<PluginData>;
  /** The Collections(Tags) belonging to the Organization */
  tags: Array<Tag>;
  /** The Credits owned by this Organization */
  credits: Array<Credit>;
  /** The organization views that belong to an organization */
  organizationViews: Array<OrganizationView>;
  /** The ID of the organization. */
  id: Scalars['ID'];
  /** The count of active billable members in the organization. Used if the organization is build only for active members. */
  activeBillableMemberCount?: Maybe<Scalars['Int']>;
  /** The count of available licenses in the organization */
  availableLicenseCount?: Maybe<Scalars['Int']>;
  /** The count of billable members in the organization. */
  billableMemberCount?: Maybe<Scalars['Int']>;
  /** The count of billable collaborators (board guests) */
  billableCollaboratorCount?: Maybe<Scalars['Int']>;
  /** The description of the team */
  desc: Scalars['String'];
  /** If the bio includes custom emoji, this object will contain the information necessary to display them. */
  descData?: Maybe<Scalars['JSONString']>;
  /** The name for the team. For example: Trello Inc */
  displayName: Scalars['String'];
  /** Exports created from this Organization */
  exports?: Maybe<Array<Export>>;
  /** The list of board ids belonging to the Organization that are visible to the user */
  idBoards: Array<Scalars['String']>;
  /** The list of the most active boards in the Organization */
  idBoardsMostActive?: Maybe<Array<Scalars['String']>>;
  /** The ID of the Enterprise this Organization belongs to */
  idEnterprise?: Maybe<Scalars['String']>;
  /** The ID of the member that created the organization */
  idMemberCreator?: Maybe<Scalars['String']>;
  /** Hash for the organization's logo */
  logoHash?: Maybe<Scalars['String']>;
  /** The limits on the Organization */
  limits: Organization_Limits;
  /** The Memberships of the Organization */
  memberships: Array<Organization_Membership>;
  /** The programmatic name for the team. For example: trelloinc */
  name: Scalars['String'];
  /** The preferences (settings) for the team */
  prefs: Organization_Prefs;
  /** The premium features allowed for this team */
  premiumFeatures: Array<PremiumFeatures>;
  /** The list of product SKUs belonging to this Organization */
  products: Array<Scalars['Int']>;
  /** The promotions used for this Organization */
  promotions: Array<Scalars['String']>;
  /** Defines the intent of the team */
  teamType?: Maybe<Scalars['String']>;
  /** The URL to the team page on Trello */
  url: Scalars['String'];
  /** The URL for the organization */
  website?: Maybe<Scalars['String']>;
  /** The Stats of the Organization used for reporting */
  stats: Organization_Stats;
  /** The Plugins owned by the Organization */
  ownedPlugins: Array<Plugin>;
  /** The new billable guests that would be added as a result of adding this board to the organization */
  newBillableGuests: Array<Organization_NewBillableGuest>;
  /** The Butler Buttons the organization owns */
  privateButlerButtons: Array<ButlerButton>;
  sharedButlerButtons: Array<ButlerButton>;
  /** The cards given a list of board IDs for Multi-Board Views. */
  cards: OrganizationCards;
  standardVariation?: Maybe<Scalars['String']>;
  /** How the Organization was created */
  creationMethod?: Maybe<Scalars['String']>;
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationBoardsArgs = {
  filter?: Maybe<Board_Filter>;
  ids?: Maybe<Array<Scalars['ID']>>;
  startIndex?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  boardLabelsLimit?: Maybe<Scalars['Int']>;
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationMembersArgs = {
  filter?: Maybe<Member_Filter>;
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationPluginsArgs = {
  filter?: Maybe<Plugin_Filter>;
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationCreditsArgs = {
  filter?: Maybe<Array<Credit_Type>>;
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationOrganizationViewsArgs = {
  filters?: Maybe<Array<OrganizationView_Filters>>;
  sortBy?: Maybe<OrganizationView_SortBy>;
  sortOrder?: Maybe<OrganizationView_SortOrder>;
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationNewBillableGuestsArgs = {
  boardId: Scalars['ID'];
};


/** Organizations, or as they are referred to in Trello, "Teams", represent collections of members and boards. */
export type OrganizationCardsArgs = {
  idBoards: Array<Scalars['ID']>;
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
  due?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  dueComplete?: Maybe<Scalars['Boolean']>;
  sortBy?: Maybe<Scalars['String']>;
  idLists?: Maybe<Array<Scalars['ID']>>;
  labels?: Maybe<Array<Scalars['String']>>;
  idMembers?: Maybe<Array<Scalars['ID']>>;
};

export type OrganizationCards = {
  __typename: 'OrganizationCards';
  cards: Array<Card>;
  total: Scalars['Int'];
  cursor: Scalars['String'];
};

/** Details of an organization view, referred to as a Workspace View in the app. */
export type OrganizationView = {
  __typename: 'OrganizationView';
  /** The id of an organization view */
  id: Scalars['ID'];
  /** The name of the organization view */
  name: Scalars['String'];
  /** The slug of the organization view */
  shortLink: Scalars['String'];
  /** The organization that the organization view belongs to */
  organization: Organization;
  /** The id of the member that created the organization view */
  idMemberCreator: Scalars['ID'];
  /** The id of the organization the view belongs to */
  idOrganization: Scalars['ID'];
  /** The id of the enterprise the view belongs to */
  idEnterprise: Scalars['String'];
  /** An object that describes the permission level of the organization view */
  prefs: OrganizationView_Prefs;
  /** The set of views within an organization view */
  views: Array<OrganizationView_View>;
};

/**
 * The filters for an organization views request. For example, used when
 * requesting all the OrganizationViews within a particular Organization
 */
export const OrganizationView_Filters = {
  /** Returns all organization views that exist in the organization. Can only be yused by team admins. */
  All: 'all',
  /** Returns all organization views that your user created. */
  Created: 'created',
  /** Returns all organization views you can see within your team */
  Team: 'team',
  /** Returns the private organization views that only your user can see. */
  Private: 'private'
} as const;

export type OrganizationView_Filters = typeof OrganizationView_Filters[keyof typeof OrganizationView_Filters];
/** Permission level of an organization view */
export type OrganizationView_Prefs = {
  __typename: 'OrganizationView_Prefs';
  /** The permission level for the organizaiton view. Currently we support 'team' and 'private' */
  permissionLevel: Scalars['String'];
};

export const OrganizationView_Prefs_PermissionLevel = {
  Team: 'team',
  Private: 'private'
} as const;

export type OrganizationView_Prefs_PermissionLevel = typeof OrganizationView_Prefs_PermissionLevel[keyof typeof OrganizationView_Prefs_PermissionLevel];
/**
 * The sorting criteria for an organization view request. For example, used when
 * requesting all the OrganizationViews within a particular Organization
 */
export const OrganizationView_SortBy = {
  /** Sorts returned organization views by their creation date */
  DateCreated: 'dateCreated',
  /** Sorts returned organization views by their name */
  Name: 'name'
} as const;

export type OrganizationView_SortBy = typeof OrganizationView_SortBy[keyof typeof OrganizationView_SortBy];
/**
 * The sort order for an organization view request. For example, used when
 * requesting all the OrganizationViews within a particular Organization
 */
export const OrganizationView_SortOrder = {
  /** Sorts returned organization views in ascending order */
  Asc: 'asc',
  /** Sorts returned organization views in ascending order */
  Ascending: 'ascending',
  /** Sorts returned organization views in descending order */
  Desc: 'desc',
  /** Sorts returned organization views in descending order */
  Descending: 'descending'
} as const;

export type OrganizationView_SortOrder = typeof OrganizationView_SortOrder[keyof typeof OrganizationView_SortOrder];
/**
 * Details of one view within an organization view. (This object is similar to a
 * single tab in a spreadsheet, where OrganizationView is the whole spreadsheet)
 */
export type OrganizationView_View = {
  __typename: 'OrganizationView_View';
  /** The ID for this view */
  id: Scalars['ID'];
  /** An object specifying which cards to include in the view */
  cardFilter: OrganizationView_View_CardFilter;
  /** The type of visualization this view uses, such as 'table' or 'timeline' */
  defaultViewType: Scalars['String'];
};

/** CardFilter model, specifying which cards are included in the view. */
export type OrganizationView_View_CardFilter = {
  __typename: 'OrganizationView_View_CardFilter';
  /** An object specifying the criteria that determines which cards are included in the view */
  criteria: Array<OrganizationView_View_CardFilter_Criteria>;
};

/**
 * CardFilter_Criteria model, specifying the criteria that decides which cards are
 * included in the view.
 */
export type OrganizationView_View_CardFilter_Criteria = {
  __typename: 'OrganizationView_View_CardFilter_Criteria';
  /** A list of board IDs whose cards will be included in the view */
  idBoards?: Maybe<Array<Scalars['ID']>>;
  idLists?: Maybe<Array<Scalars['ID']>>;
  idMembers?: Maybe<Array<Scalars['ID']>>;
  start?: Maybe<CardFilter_Criteria_DateRange>;
  due?: Maybe<CardFilter_Criteria_DateRange>;
  labels?: Maybe<Array<Scalars['String']>>;
  dueComplete?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Array<Scalars['String']>>;
};

/** A filter for the Organizations being requested */
export const Organization_Filter = {
  /** Returns all Organizations that have visibility set to Private */
  Members: 'members',
  /** Returns all Organizations that have visibility set to Public */
  Public: 'public'
} as const;

export type Organization_Filter = typeof Organization_Filter[keyof typeof Organization_Filter];
/** The limits on the Organization */
export type Organization_Limits = {
  __typename: 'Organization_Limits';
  /** The org limits */
  orgs: Organization_Limits_Orgs;
};

export type Organization_Limits_Orgs = {
  __typename: 'Organization_Limits_Orgs';
  /** The total Members per Organization limit */
  totalMembersPerOrg: Limit;
  /** The free Boards per Organization limit */
  freeBoardsPerOrg: Limit;
};

/** An association between a Member and an Organization */
export type Organization_Membership = {
  __typename: 'Organization_Membership';
  /** The ID of the Membership */
  id: Scalars['String'];
  /** The ID of the Member */
  idMember: Scalars['String'];
  /** The type of Membership this is */
  memberType: Organization_Membership_MemberType;
  /** Whether the Member has confirmed their email address */
  unconfirmed: Scalars['Boolean'];
  /** Whether the Member has been deactivated */
  deactivated: Scalars['Boolean'];
  /** The Member this membership is for */
  member: Member;
};

/** The type of membership a member has on an Organization */
export const Organization_Membership_MemberType = {
  /** A normal member */
  Normal: 'normal',
  /** An admin */
  Admin: 'admin'
} as const;

export type Organization_Membership_MemberType = typeof Organization_Membership_MemberType[keyof typeof Organization_Membership_MemberType];
/** Information about a member that would become a billable guest */
export type Organization_NewBillableGuest = {
  __typename: 'Organization_NewBillableGuest';
  /** The ID of the Member */
  id: Scalars['ID'];
  /** The full display name for the member. */
  fullName?: Maybe<Scalars['String']>;
  /** The username for the member. What is shown in @mentions for example. */
  username: Scalars['String'];
  /** Whether the member has confirmed their email address after signing up. */
  confirmed: Scalars['Boolean'];
  /** The member's initials, used for display when there isn't an avatar set. */
  initials: Scalars['String'];
};

/** The preferences for an Organization */
export type Organization_Prefs = {
  __typename: 'Organization_Prefs';
  /** The associated google apps domain */
  associatedDomain?: Maybe<Scalars['String']>;
  /** Whether external members can be added to an Organization's boards */
  externalMembersDisabled?: Maybe<Scalars['Boolean']>;
  /** An array of attachment types. Will always include 'trello' */
  attachmentRestrictions?: Maybe<Array<Scalars['String']>>;
  /** The restrictions on who can delete a Board */
  boardDeleteRestrict?: Maybe<Organization_Prefs_BoardDeleteRestrict>;
  /** The restrictions on who can view a Board */
  boardVisibilityRestrict?: Maybe<Organization_Prefs_BoardVisibilityRestrict>;
  /** Restrictions on emails allowed to invite to the Organization */
  orgInviteRestrict?: Maybe<Array<Scalars['String']>>;
  /** Restrictions on emails allowed to invite to the Organization */
  boardInviteRestrict?: Maybe<Scalars['String']>;
  /** The visibility of the Organization */
  permissionLevel?: Maybe<Organization_Prefs_PermissionLevel>;
};

/** An object that represents a set of restrictions for a Board deletion */
export type Organization_Prefs_BoardDeleteRestrict = {
  __typename: 'Organization_Prefs_BoardDeleteRestrict';
  /** How private boards should be restricted */
  private: Organization_Prefs_RestrictionType;
  /** How organization boards should be restricted */
  org: Organization_Prefs_RestrictionType;
  /** How enterprise boards should be restricted */
  enterprise: Organization_Prefs_RestrictionType;
  /** How public boards should be restricted */
  public: Organization_Prefs_RestrictionType;
};

/** An object that represents a set of restrictions for a Board visibility */
export type Organization_Prefs_BoardVisibilityRestrict = {
  __typename: 'Organization_Prefs_BoardVisibilityRestrict';
  /** How private boards should be restricted */
  private: Organization_Prefs_RestrictionType;
  /** How organization boards should be restricted */
  org: Organization_Prefs_RestrictionType;
  /** How enterprise boards should be restricted */
  enterprise: Organization_Prefs_RestrictionType;
  /** How public boards should be restricted */
  public: Organization_Prefs_RestrictionType;
};

/** The permission level (visibility) of an Organization */
export const Organization_Prefs_PermissionLevel = {
  /** Publicly visible */
  Public: 'public',
  /** Only visible to Members of the Organization */
  Private: 'private'
} as const;

export type Organization_Prefs_PermissionLevel = typeof Organization_Prefs_PermissionLevel[keyof typeof Organization_Prefs_PermissionLevel];
/** A permission level for a board restriction */
export const Organization_Prefs_RestrictionType = {
  /** Anyone in the Organization */
  Org: 'org',
  /** Only admins */
  Admin: 'admin',
  /** No one */
  None: 'none'
} as const;

export type Organization_Prefs_RestrictionType = typeof Organization_Prefs_RestrictionType[keyof typeof Organization_Prefs_RestrictionType];
/** Stats reported on at the organization level */
export type Organization_Stats = {
  __typename: 'Organization_Stats';
  /** The id of the organization the stats are for. */
  id: Scalars['ID'];
  /** The cards stats for the organization. */
  cards: Organization_Stats_Cards;
  /** The labelNames used on boards in the organization. */
  labelNames: Organization_Stats_LabelNames;
};


/** Stats reported on at the organization level */
export type Organization_StatsCardsArgs = {
  groupBy?: Maybe<Organization_Stats_Cards_GroupBy>;
  idBoards?: Maybe<Array<Scalars['ID']>>;
  idMembers?: Maybe<Array<Scalars['ID']>>;
  idLabels?: Maybe<Array<Scalars['ID']>>;
  dueDateSince?: Maybe<Scalars['String']>;
  dueDateUntil?: Maybe<Scalars['String']>;
  refreshTime?: Maybe<Scalars['Int']>;
};

/** Cards stats reported on at the organization level */
export type Organization_Stats_Cards = {
  __typename: 'Organization_Stats_Cards';
  /** Whether the stats are complete or not  */
  incomplete: Scalars['Boolean'];
  /** The cards stats */
  stats: Array<Organization_Stats_Cards_Stat>;
};

/** The possible options for grouping an organization's card stats */
export const Organization_Stats_Cards_GroupBy = {
  Label: 'label',
  LabelName: 'labelName',
  Member: 'member'
} as const;

export type Organization_Stats_Cards_GroupBy = typeof Organization_Stats_Cards_GroupBy[keyof typeof Organization_Stats_Cards_GroupBy];
/**
 * A stat on the number of cards in an organization
 * with a certain property, potentially grouped and filtered
 */
export type Organization_Stats_Cards_Stat = {
  __typename: 'Organization_Stats_Cards_Stat';
  /** The id of the label that the stat is grouped by. */
  idLabel?: Maybe<Scalars['ID']>;
  /** The name of the label that the stat is grouped by. */
  labelName?: Maybe<Scalars['String']>;
  /** The id of the member that the stat is grouped by. */
  idMember?: Maybe<Scalars['ID']>;
  /** The number and ids of overdue cards. */
  overdue: Organization_Stats_Cards_Stat_Overdue;
  /** The number and ids of upcoming cards. */
  upcoming: Organization_Stats_Cards_Stat_Upcoming;
  /** The number and ids of done cards. */
  done: Organization_Stats_Cards_Stat_Done;
  /** The number and ids of cards with no due date. */
  noDueDate: Organization_Stats_Cards_Stat_NoDueDate;
};

export type Organization_Stats_Cards_Stat_Done = {
  __typename: 'Organization_Stats_Cards_Stat_Done';
  /** The number of done cards */
  count: Scalars['Int'];
  /** The IDs of the done cards */
  ids?: Maybe<Array<Scalars['ID']>>;
};

export type Organization_Stats_Cards_Stat_NoDueDate = {
  __typename: 'Organization_Stats_Cards_Stat_NoDueDate';
  /** The number of cards with no due date */
  count: Scalars['Int'];
  /** The IDs of the cards with no due date */
  ids?: Maybe<Array<Scalars['ID']>>;
};

export type Organization_Stats_Cards_Stat_Overdue = {
  __typename: 'Organization_Stats_Cards_Stat_Overdue';
  /** The number of overdue cards */
  count: Scalars['Int'];
  /** The IDs of the overdue cards */
  ids?: Maybe<Array<Scalars['ID']>>;
};

export type Organization_Stats_Cards_Stat_Upcoming = {
  __typename: 'Organization_Stats_Cards_Stat_Upcoming';
  /** The number of upcoming cards */
  count: Scalars['Int'];
  /** The IDs of the upcoming cards */
  ids?: Maybe<Array<Scalars['ID']>>;
};

/** Grouped labels with the same name at the organization level */
export type Organization_Stats_LabelName_Stat = {
  __typename: 'Organization_Stats_LabelName_Stat';
  /** Number of unique labels with this name */
  count: Scalars['Int'];
  /** The IDs of each label within this group */
  ids: Array<Scalars['ID']>;
  /** The name of the label */
  name: Scalars['String'];
  /** The number of times a label with this name has been used */
  totalUses: Scalars['Int'];
};

/** LabelNames stats reported at the organization level */
export type Organization_Stats_LabelNames = {
  __typename: 'Organization_Stats_LabelNames';
  /** Whether the stats are complete or not  */
  incomplete: Scalars['Boolean'];
  /** The labelName stats */
  stats: Array<Organization_Stats_LabelName_Stat>;
};

/** Details of a paid account */
export type PaidAccount = {
  __typename: 'PaidAccount';
  /** The product codes associated with this account */
  products: Array<Scalars['Int']>;
  /** Details about the account's invoice */
  invoiceDetails?: Maybe<Scalars['String']>;
  /** The expiration dates of the account's products */
  expirationDates: Scalars['JSONString'];
  /** The billing dates of the account's products */
  billingDates: Scalars['JSONString'];
  /** The date when the account's paidAccount was initialized */
  dateFirstSubscription: Scalars['String'];
  /** The locale of the account's contact */
  contactLocale: Scalars['String'];
  /** The email of the account's contact */
  contactEmail: Scalars['String'];
  /** The full name of the account's contact */
  contactFullName: Scalars['String'];
  /** The last 4 digits of the account's credit card */
  cardLast4: Scalars['String'];
  /** The type of the credit card used for the account */
  cardType: Scalars['String'];
  /** The standing of the account */
  standing: Scalars['Int'];
  /** The subscriber ID of the account */
  ixSubscriber: Scalars['Int'];
  /** Billing address: Zip/Postal code */
  zip?: Maybe<Scalars['String']>;
  /** Billing address: Country */
  country?: Maybe<Scalars['String']>;
  /** The taxId for this account */
  taxId?: Maybe<Scalars['String']>;
  /** The expiration date for the account's free trial */
  trialExpiration: Scalars['String'];
  /** Previous subscription data for cancelled or expired accounts */
  previousSubscription?: Maybe<PreviousSubscription>;
};

export const PaidAccountType = {
  Organizations: 'organizations',
  Members: 'members'
} as const;

export type PaidAccountType = typeof PaidAccountType[keyof typeof PaidAccountType];
export type Plugin = {
  __typename: 'Plugin';
  /** The ID of the plugin. */
  id: Scalars['ID'];
  /** The name of the plugin's author. */
  author: Scalars['String'];
  /** API Key associated with this plugin. */
  apiKey?: Maybe<Scalars['String']>;
  /** Capabilities represent areas of the UX that a plugin can hook into. */
  capabilities: Array<Scalars['String']>;
  /** Options that modify the way capabilities are called and responded to. */
  capabilitiesOptions: Array<Scalars['String']>;
  /** A list of categories which the plugin will be listed under. */
  categories: Array<Scalars['String']>;
  /** The URL to the main iframe of the plugin. */
  iframeConnectorUrl: Scalars['String'];
  /** The ID of the organization the plugin belongs to. */
  idOrganizationOwner: Scalars['String'];
  /** The URL to the privacy policy of the plugin. */
  privacyUrl?: Maybe<Scalars['String']>;
  /** Whether the plugin is available to the public. */
  public: Scalars['Boolean'];
  /** The moderated state of a plugin. Used to hide or turn off problematic plugins. */
  moderatedState?: Maybe<Plugin_ModeratedState>;
  /** Deprecated name of the plugin. */
  name?: Maybe<Scalars['String']>;
  /** The support email of a plugin. */
  supportEmail?: Maybe<Scalars['String']>;
  /** A list of tags used to make a plugin featued. */
  tags: Array<Scalars['String']>;
  /** The compliance information of the plugin. */
  compliance?: Maybe<Plugin_Compliance>;
  /** If the plugin is compliant with privacy standards. */
  isCompliantWithPrivacyStandards?: Maybe<Scalars['Boolean']>;
  /** The email address of the plugin author. */
  email?: Maybe<Scalars['String']>;
  /** The icon of the plugin. */
  icon: Plugin_Icon;
  /** Urls to the hero image of a plugin. */
  heroImageUrl?: Maybe<Scalars['JSONString']>;
  /** Listing information of the plugin. */
  listing?: Maybe<Plugin_Listing>;
  /** A list of listing information of the plugin in different locales. */
  listings?: Maybe<Array<Plugin_Listings>>;
  /** Usage bracket information of the plugin. */
  usageBrackets: Plugin_UsageBrackets;
  /** Daily statistics about the plugin. */
  stats: Array<Plugin_Stat>;
  /** The plugin collaborators who can edit the plugin */
  collaborators: Array<Member>;
};

/** Data stored by a plugin */
export type PluginData = {
  __typename: 'PluginData';
  /** The id of the PluginData */
  id: Scalars['ID'];
  /** The id of the Plugin */
  idPlugin: Scalars['String'];
  /** The model type the data is scoped to */
  scope: PluginData_Scope;
  /** The id of the model the data is scoped to */
  idModel: Scalars['String'];
  /** Whether the PluginData is private or shared */
  access: PluginData_Access;
  /** The data being stored */
  value: Scalars['String'];
};

/** Whether the PluginData is private or shared */
export const PluginData_Access = {
  Private: 'private',
  Shared: 'shared'
} as const;

export type PluginData_Access = typeof PluginData_Access[keyof typeof PluginData_Access];
/** The model type the data is scoped to */
export const PluginData_Scope = {
  Board: 'board',
  Member: 'member',
  Card: 'card',
  Organization: 'organization'
} as const;

export type PluginData_Scope = typeof PluginData_Scope[keyof typeof PluginData_Scope];
/** An object representing the response of the updatePluginCollaborator mutation. */
export type Plugin_Collaborators_UpdateResponse = {
  __typename: 'Plugin_Collaborators_UpdateResponse';
  /** Whether or not the update was successful */
  success: Scalars['Boolean'];
};

/** The compliance information of the plugin. */
export type Plugin_Compliance = {
  __typename: 'Plugin_Compliance';
  /** The timestamp of when the storesPersonalData property was changed. */
  dateUpdatedStoresPersonalData: Scalars['String'];
  /** Whether the plugin stores personal data. */
  storesPersonalData: Scalars['Boolean'];
  /** The timestamps of when the plugin last polled the compliance URLs. */
  lastPolled: Plugin_Compliance_LastPolled;
};

/** The timestamps of when the plugin last polled the compliance URLs. */
export type Plugin_Compliance_LastPolled = {
  __typename: 'Plugin_Compliance_LastPolled';
  /** When it last hit the member privacy polling URL. */
  memberPrivacy: Scalars['String'];
};

/** An object representing the response from the deletePlugin mutation. */
export type Plugin_DeleteResponse = {
  __typename: 'Plugin_DeleteResponse';
  /** Whether the deletion was successful */
  success: Scalars['Boolean'];
};

export type Plugin_EnableResponse = {
  __typename: 'Plugin_EnableResponse';
  /** Whether the enablement was successful. */
  success: Scalars['Boolean'];
  /** Error message for why enablement failed. */
  error?: Maybe<Scalars['String']>;
};

export const Plugin_Filter = {
  None: 'none',
  Enabled: 'enabled',
  Available: 'available',
  All: 'all',
  HasClaimedDomains: 'hasClaimedDomains',
  Owned: 'owned',
  Editable: 'editable'
} as const;

export type Plugin_Filter = typeof Plugin_Filter[keyof typeof Plugin_Filter];
/** The icon of a Organization Owned Plugin. */
export type Plugin_Icon = {
  __typename: 'Plugin_Icon';
  /** The URL to the icon. */
  url: Scalars['String'];
};

/** Localized listing information of a Plugin. */
export type Plugin_Listing = {
  __typename: 'Plugin_Listing';
  /** id of the plugin listing. */
  id?: Maybe<Scalars['ID']>;
  /** The name of the plugin. */
  name: Scalars['String'];
  /** The locale of the listing. */
  locale: Scalars['String'];
  /** The description of the plugin. */
  description: Scalars['String'];
  /** The overview of the plugin. */
  overview: Scalars['String'];
};

/** An object representing the response from the deletePluginListing mutation. */
export type Plugin_Listing_DeleteResponse = {
  __typename: 'Plugin_Listing_DeleteResponse';
  /** Whether the deletion was successful */
  success: Scalars['Boolean'];
};

/** Array of Localized listing information of a Plugin. */
export type Plugin_Listings = {
  __typename: 'Plugin_Listings';
  /** id of the plugin listing. */
  id: Scalars['ID'];
  /** The name of the plugin. */
  name: Scalars['String'];
  /** The locale of the listing. */
  locale: Scalars['String'];
  /** The description of the plugin. */
  description: Scalars['String'];
  /** The overview of the plugin. */
  overview: Scalars['String'];
};

/** The moderated state of a plugin. Used to hide or turn off problematic plugins. */
export const Plugin_ModeratedState = {
  /** The plugin is hidden from listings but still functional on boards that have it enabled. */
  Hidden: 'hidden',
  /** The plugin is hidden from listings and boards. */
  Moderated: 'moderated'
} as const;

export type Plugin_ModeratedState = typeof Plugin_ModeratedState[keyof typeof Plugin_ModeratedState];
/** A record of daily statistics about the plugin. */
export type Plugin_Stat = {
  __typename: 'Plugin_Stat';
  /** The date the stat was captured. */
  date: Scalars['String'];
  /** The number of boards using this plugin. */
  boardCount: Scalars['Int'];
};

/** Usage bracket information of the plugin. */
export type Plugin_UsageBrackets = {
  __typename: 'Plugin_UsageBrackets';
  /** The number of boards the plugin is enabled on. */
  boards: Scalars['Int'];
};

/**
 * All premium features associated with a given product returned by server
 * Should be synchronized with: https://bitbucket.org/trello/server/src/main/app/data/features.js
 */
export const PremiumFeatures = {
  Activity: 'activity',
  AdditionalBoardBackgrounds: 'additionalBoardBackgrounds',
  AdditionalStickers: 'additionalStickers',
  AdvancedChecklists: 'advancedChecklists',
  BoardExport: 'boardExport',
  Butler: 'butler',
  ButlerBc: 'butlerBC',
  ButlerEnterprise: 'butlerEnterprise',
  ButlerPremium: 'butlerPremium',
  ButlerStandard: 'butlerStandard',
  Crown: 'crown',
  CsvExport: 'csvExport',
  CustomBoardBackgrounds: 'customBoardBackgrounds',
  CustomEmoji: 'customEmoji',
  CustomStickers: 'customStickers',
  Deactivated: 'deactivated',
  EnterpriseUi: 'enterpriseUI',
  Export: 'export',
  GoldMembers: 'goldMembers',
  GoogleApps: 'googleApps',
  InfinitePlugins: 'infinitePlugins',
  InviteBoard: 'inviteBoard',
  InviteOrg: 'inviteOrg',
  IsBc: 'isBC',
  IsPremium: 'isPremium',
  IsStandard: 'isStandard',
  LargeAttachments: 'largeAttachments',
  MultiBoardGuests: 'multiBoardGuests',
  Observers: 'observers',
  PaidCorePlugins: 'paidCorePlugins',
  Plugins: 'plugins',
  PrivateTemplates: 'privateTemplates',
  ReadSecrets: 'readSecrets',
  Removal: 'removal',
  RestrictVis: 'restrictVis',
  SavedSearches: 'savedSearches',
  ShortExportHistory: 'shortExportHistory',
  StarCounts: 'starCounts',
  Stats: 'stats',
  SuperAdmins: 'superAdmins',
  Tags: 'tags',
  ThreePlugins: 'threePlugins',
  Views: 'views'
} as const;

export type PremiumFeatures = typeof PremiumFeatures[keyof typeof PremiumFeatures];
/** Previous subscription data for cancelled or expired accounts */
export type PreviousSubscription = {
  __typename: 'PreviousSubscription';
  /** The previous product on the account */
  ixSubscriptionProductId: Scalars['Int'];
  /** The date that the previous product was cancelled */
  dtCancelled: Scalars['String'];
};

/** Price quote for a subscription */
export type PriceQuote = {
  __typename: 'PriceQuote';
  /** The product code for the product being quoted */
  ixSubscriptionProduct: Scalars['Int'];
  /** The billing date for the price quote */
  dtBilling: Scalars['String'];
  /** The subscription period in months (1 or 12) */
  nSubscriptionPeriodMonths: Scalars['Int'];
  /** The subscription discount type for the quote */
  ixSubscriptionDiscountType: Scalars['Int'];
  /** The pricing adjustment (discount multiplier) for the quote */
  nPricingAdjustment: Scalars['Float'];
  /** The expiration date of the pricing adjustment for the quote, or null */
  dtPricingAdjustmentExpiration?: Maybe<Scalars['String']>;
  /** The number of team members being quoted */
  cTeamMembers: Scalars['Int'];
  /** The number of billable collaborators being quoted */
  cBillableCollaborators: Scalars['Int'];
  /** The number of billable collaborators being converted */
  cBillableCollaboratorConversions: Scalars['Int'];
  /** The tax rate for the quote, null if tax info is unavailable */
  nTaxRate?: Maybe<Scalars['Float']>;
  /** The abbreviation for the region the tax is applied from (such as the state), null if tax info is unavailable */
  sTaxRegion?: Maybe<Scalars['String']>;
  /** The pre-tax subtotal of the quote */
  nSubtotal: Scalars['Float'];
  /** The per-user pre-tax subtotal of the quote */
  nSubtotalPerUser: Scalars['Float'];
  /** The tax for the quote, null if tax info is unavailable */
  nTax?: Maybe<Scalars['Float']>;
  /** The per-user tax for the quote, null if tax info is unavailable */
  nTaxPerUser?: Maybe<Scalars['Float']>;
  /** The total for the quote, null if tax info is unavailable */
  nTotal?: Maybe<Scalars['Float']>;
  /** The per-user total for the quote, null if tax info is unavailable */
  nTotalPerUser?: Maybe<Scalars['Float']>;
};

/** Price quotes for a subscription */
export type PriceQuoteInfo = {
  __typename: 'PriceQuoteInfo';
  /** The price quote for an annual subscription */
  annual?: Maybe<PriceQuote>;
  /** The price quote for a monthly subscription */
  monthly?: Maybe<PriceQuote>;
  /** The annual savings for choosing an annual subscription */
  nAnnualSavings?: Maybe<Scalars['Float']>;
  /** The percentage savings for choosing an annual subscription */
  nAnnualPercentageSavings?: Maybe<Scalars['Float']>;
};

/** Base64 encoded image data for the QR code. */
export type QrCode = {
  __typename: 'QrCode';
  imageData: Scalars['String'];
};

export type Query = {
  __typename: 'Query';
  announcements: Array<Announcement>;
  board?: Maybe<Board>;
  boards: Array<Board>;
  boardAccessRequest: BoardAccessRequest;
  checklist?: Maybe<Checklist>;
  checklists: Array<Checklist>;
  atlassianAccounts: Array<AtlassianAccount>;
  list?: Maybe<List>;
  lists: Array<List>;
  emailProvider: EmailProvider;
  member?: Maybe<Member>;
  members: Array<Member>;
  memberCards: Array<Card>;
  card?: Maybe<Card>;
  cards: Array<Card>;
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  organizationMemberCards: Array<Card>;
  organizationView?: Maybe<OrganizationView>;
  organizationViews: Array<OrganizationView>;
  label?: Maybe<Label>;
  labels: Array<Label>;
  notificationGroups?: Maybe<Array<Maybe<NotificationGroup>>>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  notificationsCount?: Maybe<Scalars['JSONString']>;
  enterprise?: Maybe<Enterprise>;
  enterprises: Array<Enterprise>;
  publicPlugins: Array<Plugin>;
  newSubscriptionListPriceQuotes: ListPriceQuoteInfo;
  newSubscriptionPriceQuotes: PriceQuoteInfo;
  upgradePriceQuotes: UpgradePriceQuoteInfo;
  renewalPriceQuotes: PriceQuoteInfo;
  addMembersPriceQuotes: AddMembersPriceQuotes;
  certCaptureToken: CertCaptureToken;
  statements: Array<Statement>;
  search: Search;
  plugin?: Maybe<Plugin>;
  plugins: Array<Plugin>;
  pluginCategories: Array<Scalars['String']>;
  qrCode: QrCode;
  unsplashPhotos: Array<UnsplashPhoto>;
  templateCategories: Array<TemplateCategory>;
  templateLanguages: Array<TemplateLanguage>;
  templateGallery: Array<Board>;
  modelType: ModelType;
};


export type QueryAnnouncementsArgs = {
  filter?: Maybe<Scalars['String']>;
};


export type QueryBoardArgs = {
  id: Scalars['ID'];
};


export type QueryBoardsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryBoardAccessRequestArgs = {
  modelType: RequestAccessModelType;
  id: Scalars['ID'];
};


export type QueryChecklistArgs = {
  id: Scalars['ID'];
};


export type QueryChecklistsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryListArgs = {
  id: Scalars['ID'];
};


export type QueryListsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryEmailProviderArgs = {
  email: Scalars['String'];
};


export type QueryMemberArgs = {
  id: Scalars['ID'];
};


export type QueryMembersArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryMemberCardsArgs = {
  id: Scalars['ID'];
  limit?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['ID']>;
  modifiedSince?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['String']>;
};


export type QueryCardArgs = {
  id: Scalars['ID'];
};


export type QueryCardsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryOrganizationArgs = {
  id: Scalars['ID'];
};


export type QueryOrganizationsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryOrganizationMemberCardsArgs = {
  id: Scalars['ID'];
  idMember: Scalars['ID'];
};


export type QueryOrganizationViewArgs = {
  id: Scalars['ID'];
};


export type QueryOrganizationViewsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryLabelArgs = {
  id: Scalars['ID'];
};


export type QueryLabelsArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryNotificationGroupsArgs = {
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  idCards?: Maybe<Array<Scalars['ID']>>;
};


export type QueryNotificationsCountArgs = {
  grouped?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<Scalars['String']>;
};


export type QueryEnterpriseArgs = {
  id: Scalars['ID'];
};


export type QueryEnterprisesArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryPublicPluginsArgs = {
  preferredLocales?: Maybe<Scalars['String']>;
};


export type QueryNewSubscriptionListPriceQuotesArgs = {
  accountType: PaidAccountType;
  accountId: Scalars['ID'];
  product: Scalars['Int'];
  includeUnconfirmed?: Maybe<Scalars['Boolean']>;
};


export type QueryNewSubscriptionPriceQuotesArgs = {
  accountType: PaidAccountType;
  accountId: Scalars['ID'];
  product: Scalars['Int'];
  country: Scalars['String'];
  postalCode?: Maybe<Scalars['String']>;
  taxId?: Maybe<Scalars['String']>;
  promoCode?: Maybe<Scalars['String']>;
  includeUnconfirmed?: Maybe<Scalars['Boolean']>;
};


export type QueryUpgradePriceQuotesArgs = {
  accountType: PaidAccountType;
  accountId: Scalars['ID'];
  product: Scalars['Int'];
};


export type QueryRenewalPriceQuotesArgs = {
  accountType: PaidAccountType;
  accountId: Scalars['ID'];
};


export type QueryAddMembersPriceQuotesArgs = {
  accountId: Scalars['ID'];
  members: Array<Scalars['String']>;
};


export type QueryCertCaptureTokenArgs = {
  accountType: PaidAccountType;
  accountId: Scalars['ID'];
};


export type QueryStatementsArgs = {
  accountType: PaidAccountType;
  accountId: Scalars['ID'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
  idBoards?: Maybe<Array<Scalars['ID']>>;
  idOrganizations?: Maybe<Array<Scalars['ID']>>;
  idCards?: Maybe<Array<Scalars['ID']>>;
  partial?: Maybe<Scalars['Boolean']>;
};


export type QueryPluginArgs = {
  id: Scalars['ID'];
};


export type QueryPluginsArgs = {
  id: Array<Scalars['ID']>;
};


export type QueryQrCodeArgs = {
  url: Scalars['String'];
};


export type QueryUnsplashPhotosArgs = {
  query?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};


export type QueryTemplateGalleryArgs = {
  locale: Scalars['String'];
};


export type QueryModelTypeArgs = {
  idOrName: Scalars['String'];
};

/** Reactions give Members the option to add an emoji to an Action. */
export type Reaction = {
  __typename: 'Reaction';
  /** The ID of the Reaction */
  id: Scalars['ID'];
  /** The ID of the Member who added the Reaction */
  idMember: Scalars['String'];
  /** The ID of the entity this Reaction is on */
  idModel: Scalars['String'];
  /** The ID of the emoji used in the Reaction */
  idEmoji: Scalars['String'];
  /** The Member who added the Reaction */
  member: Member;
  /** The Emoji used on the Reaction */
  emoji: Reaction_Emoji;
};

/** The emoji used on the Reaction */
export type Reaction_Emoji = {
  __typename: 'Reaction_Emoji';
  /** The ID of the Emoji */
  unified: Scalars['String'];
  /** The native Emoji */
  native: Scalars['String'];
  /** The name of the Emoji */
  name: Scalars['String'];
  /** The skin variation of the Emoji */
  skinVariation?: Maybe<Scalars['String']>;
  /** The short name for the Emoji */
  shortName: Scalars['String'];
};

/** Response from removing a member from a Workspace */
export type RemoveMembersFromWorkspace_Response = {
  __typename: 'RemoveMembersFromWorkspace_Response';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

/** Request Access to cards/boards */
export const RequestAccessModelType = {
  Card: 'card',
  Board: 'board'
} as const;

export type RequestAccessModelType = typeof RequestAccessModelType[keyof typeof RequestAccessModelType];
/** A saved search query belonging to a Member */
export type SavedSearch = {
  __typename: 'SavedSearch';
  /** The ID of the saved search */
  id: Scalars['ID'];
  /** The name of the saved search */
  name: Scalars['String'];
  /** The query of the saved search */
  query: Scalars['String'];
  /** The position of the saved search in the UI */
  pos: Scalars['Int'];
};

/** The result returned from a search query */
export type Search = {
  __typename: 'Search';
  /** Info about the search performed */
  options?: Maybe<Search_Options>;
  /** Board results from the search */
  boards: Array<Board>;
  /** Card results from the search */
  cards: Array<Card>;
  /**
   * There is currently a server bug where the `members` field
   * won't be present if there are no member results. `members`
   * should be non-nullable when that bug is fixed.
   *
   * Member results from the search
   */
  members?: Maybe<Array<Member>>;
  /** Organization results from the search */
  organizations: Array<Organization>;
};


/** The result returned from a search query */
export type SearchBoardsArgs = {
  limit?: Maybe<Scalars['Int']>;
};


/** The result returned from a search query */
export type SearchCardsArgs = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


/** The result returned from a search query */
export type SearchMembersArgs = {
  limit?: Maybe<Scalars['Int']>;
};


/** The result returned from a search query */
export type SearchOrganizationsArgs = {
  limit?: Maybe<Scalars['Int']>;
};

/** Info about the options passed to the performed search */
export type Search_Options = {
  __typename: 'Search_Options';
  /** The terms used to perform the search (parsed from the passed in query) */
  terms?: Maybe<Array<Search_Options_Term>>;
  /** The modifiers used to perform the search (parsed from the passed in query) */
  modifiers?: Maybe<Array<Search_Options_Modifier>>;
  /** The modelTypes requested */
  modelTypes?: Maybe<Array<Scalars['String']>>;
  /**
   * Whether or not the partial flag was set for the search.
   *
   * By default, search will match the words in your query exactly. Setting the `partial`
   * flag to true means that search will look for content that starts with any of the
   * words in your query.
   */
  partial?: Maybe<Scalars['Boolean']>;
};

/**
 * A modifier used in a search query
 * e.g. In the query "is:open sort:created development",
 * `is:open` and `sort:created` are the modifiers
 */
export type Search_Options_Modifier = {
  __typename: 'Search_Options_Modifier';
  /** The text of the modifier */
  text?: Maybe<Scalars['String']>;
};

/**
 * A term used in a search query
 * e.g. In the query "is:open sort:created development",
 * `development` is the only term
 */
export type Search_Options_Term = {
  __typename: 'Search_Options_Term';
  text?: Maybe<Scalars['String']>;
};

/** The counts for a Board being starred */
export type StarCounts = {
  __typename: 'StarCounts';
  /** The number of Organization Members who have starred this Board */
  organization: Scalars['Int'];
};

/** Items in your Billing History */
export type Statement = {
  __typename: 'Statement';
  /** Id for this statement. Same as the statementToken */
  id: Scalars['ID'];
  /** Date payment or credit was applied */
  date: Scalars['String'];
  /** Dollar amount credited or debited */
  amount: Scalars['Float'];
  /** Description of the statement */
  item: Scalars['String'];
  /** URL to the meta page to view the receipt/invoice */
  statementUrl: Scalars['String'];
  /** Id for this statement */
  statementToken: Scalars['ID'];
  /** Translation key used for localizing the item description */
  translationKey: Scalars['String'];
  /** Translation substitutions */
  translationSubstitutions?: Maybe<TranslationSubstitutions>;
};

/** An instance of a sticker on a card */
export type Sticker = {
  __typename: 'Sticker';
  /** ID of the card sticker */
  id: Scalars['ID'];
  /** Top position of the sticker on the card */
  top: Scalars['Int'];
  /** Left position of the sticker on the card */
  left: Scalars['Int'];
  /** z-index of the sticker on the card */
  zIndex: Scalars['Int'];
  /** Rotations of the sticker on the card */
  rotate: Scalars['Int'];
  /** ID of the image used for the sticker */
  image: Scalars['String'];
  /** URL of the image used for the sticker */
  imageUrl: Scalars['String'];
  /** List of different scalings of the sticker image */
  imageScaled: Array<Sticker_ImageScaled>;
};

/** A scaled version of a cards sticker image */
export type Sticker_ImageScaled = {
  __typename: 'Sticker_ImageScaled';
  /** ID of the sticker image scaled */
  id: Scalars['ID'];
  /** Width of the image */
  width: Scalars['Int'];
  /** Height of the image */
  height: Scalars['Int'];
  /** URL of the image */
  url: Scalars['String'];
  /** Whether or not the image was scaled */
  scaled: Scalars['Boolean'];
  /** Size of the image in bytes. (only present for custom stickers) */
  bytes?: Maybe<Scalars['Int']>;
};

/** A Tag (or Collection as it is known in-app) is a 'category' that can be applied to Boards */
export type Tag = {
  __typename: 'Tag';
  /** ID of the Tag */
  id: Scalars['ID'];
  /** name of the Tag */
  name: Scalars['String'];
};

/** Category for template gallery returned from /resources/templates/categories */
export type TemplateCategory = {
  __typename: 'TemplateCategory';
  /** Translations key for template category */
  key: Scalars['String'];
};

/** An object containing information about a the gallery listing */
export type TemplateGallery = {
  __typename: 'TemplateGallery';
  /** The shape the avatar should be */
  avatarShape: Scalars['String'];
  /** The url for the listing's avatar */
  avatarUrl: Scalars['String'];
  /** The authors name */
  byline: Scalars['String'];
  /** The category the template is in */
  category: Scalars['String'];
  /** The precedence the template has for ordering */
  precedence: Scalars['Int'];
  /** The blurb for the template's gallery listing */
  blurb: Scalars['String'];
  /** The featured status of the board */
  featured: Scalars['Boolean'];
  /** The view and copy counts of the board */
  stats: Board_Stats;
};

/** Language for template gallery returned from /resources/templates/languages */
export type TemplateLanguage = {
  __typename: 'TemplateLanguage';
  /** The language key */
  language: Scalars['String'];
  /** The language's locale code */
  locale: Scalars['String'];
  /** The english user-readable description of the language */
  description: Scalars['String'];
  /** The localized user-readable description of the language */
  localizedDescription: Scalars['String'];
  /** Flag to determine if language is currently enabled */
  enabled: Scalars['Boolean'];
};

/** Token model */
export type Token = {
  __typename: 'Token';
  id: Scalars['ID'];
  dateCreated: Scalars['String'];
  dateExpires?: Maybe<Scalars['String']>;
  idMember: Scalars['String'];
  identifier: Scalars['String'];
  permissions: Array<Maybe<TokenPermission>>;
};

/** The permissions for a specific token */
export type TokenPermission = {
  __typename: 'TokenPermission';
  idModel: Scalars['String'];
  modelType: Scalars['String'];
  read?: Maybe<Scalars['Boolean']>;
  write?: Maybe<Scalars['Boolean']>;
};

/** Data which represents the effects of transferring a team to an enterprise. */
export type TransferrableData = {
  __typename: 'TransferrableData';
  /** Whether the team is transferrable */
  transferrable?: Maybe<Scalars['Boolean']>;
  /** A list of members who will be counted towards billing upon transferring the team */
  newBillableMembers: Array<TransferrableDataMember>;
  /** A list of members who will be removed from the team upon transfering it to the enterprise */
  restrictedMembers: Array<TransferrableDataMember>;
};

/**
 * Either a billable member of a restricted member (see TransferrableData). It is not a model,
 * but rather just a set of fields of a Member that is solely used for the enteprise dashboard.
 */
export type TransferrableDataMember = {
  __typename: 'TransferrableDataMember';
  fullName: Scalars['String'];
  username: Scalars['String'];
  initials: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
};

export type TranslationSubstitutions = {
  __typename: 'TranslationSubstitutions';
  productName?: Maybe<Scalars['String']>;
};

/**
 * A photo returned from the Unsplash API
 * https://unsplash.com/documentation
 */
export type UnsplashPhoto = {
  __typename: 'UnsplashPhoto';
  /** ID of the UnsplashPhoto */
  id: Scalars['ID'];
  /** Date and time of when the photo was created, in ISO 8601 format (e.g., 2019-08-21T19:58:40-04:00) */
  created_at: Scalars['String'];
  /** Date and time of when the photo was last updated, in ISO 8601 format (e.g., 2019-08-21T19:58:40-04:00) */
  updated_at: Scalars['String'];
  /** Width of the full size image in pixels */
  width: Scalars['Int'];
  /** Height of the full size image in pixels */
  height: Scalars['Int'];
  /** A color associated with the image, in html hex format (e.g., #DCDBE1) */
  color: Scalars['String'];
  /** Text describing what is shown in the photo */
  description?: Maybe<Scalars['String']>;
  /** Urls pointing to various sizes of the image */
  urls: UnsplashPhoto_Urls;
  /** Links to various ways of accessing this photo (through the API or in a web browser) */
  links: UnsplashPhoto_Links;
  /** List of categories associated with the photo */
  categories: Array<Scalars['String']>;
  /** Number of users that have liked this photo */
  likes: Scalars['Int'];
  /** Information about the Unsplash user who created this photo */
  user: UnsplashPhoto_User;
};

/**
 * Links to various ways of accessing an Unsplash photo (through the API or in a web browser)
 * https://unsplash.com/documentation#photos
 */
export type UnsplashPhoto_Links = {
  __typename: 'UnsplashPhoto_Links';
  /** The Unsplash API url for this photo */
  self: Scalars['String'];
  /** Url of the html page for viewing this photo on Unsplash's website */
  html: Scalars['String'];
  /** Url of the image file on Unsplash's website */
  download: Scalars['String'];
  /** Url of the image file on Unsplash's API */
  download_location: Scalars['String'];
};

/**
 * Urls pointing to various sizes of the UnsplashPhoto image
 * https://unsplash.com/documentation#example-image-use
 */
export type UnsplashPhoto_Urls = {
  __typename: 'UnsplashPhoto_Urls';
  /** The photo in jpg format with its maximum dimensions. For performance purposes, we don’t recommend using this as the photos will load slowly for your users. */
  full: Scalars['String'];
  /** The photo in jpg format with a width of 1080 pixels */
  regular: Scalars['String'];
  /** The photo in jpg format with a width of 400 pixels */
  small: Scalars['String'];
  /** The photo in jpg format with a width of 200 pixels */
  thumb: Scalars['String'];
  /** A base image URL with just the photo path and the ixid parameter for your API application. Use this to easily add additional image parameters to construct your own image URL. */
  raw: Scalars['String'];
};

/**
 * Information about an Unsplash user's public profile
 * https://unsplash.com/documentation#get-a-users-public-profile
 */
export type UnsplashPhoto_User = {
  __typename: 'UnsplashPhoto_User';
  /** ID of the UnsplashPhoto_user */
  id: Scalars['ID'];
  /** The user's full name */
  name: Scalars['String'];
  /** Links to various ways of accessing this user's info (through the API or through a web browser) */
  links: UnsplashPhoto_User_Links;
};

/**
 * Links to various ways of accessing an Unsplash user's public profile info (through the API or through a web browser)
 * https://unsplash.com/documentation#get-a-users-public-profile
 */
export type UnsplashPhoto_User_Links = {
  __typename: 'UnsplashPhoto_User_Links';
  /** Url of the user's html profile page on Unsplash's website */
  html: Scalars['String'];
};

export type UpdateDashboardViewTile = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  from?: Maybe<UpdateDashboardViewTile_From>;
  graph?: Maybe<UpdateDashboardViewTile_Graph>;
};

export type UpdateDashboardViewTile_From = {
  dateType: Scalars['String'];
  value: Scalars['Int'];
};

export type UpdateDashboardViewTile_Graph = {
  type: Scalars['String'];
};

export type UpdatePluginFields = {
  /** The name of the plugin's author. */
  author?: Maybe<Scalars['String']>;
  /** Capabilities represent areas of the UX that a plugin can hook into. */
  capabilities?: Maybe<Array<Scalars['String']>>;
  /** Capabilities Options represent areas of capabilities that can be customized. */
  capabilitiesOptions?: Maybe<Array<Scalars['String']>>;
  /** A list of categories which the plugin will be listed under. */
  categories?: Maybe<Array<Scalars['String']>>;
  /** The URL to the main iframe of the plugin. */
  iframeConnectorUrl?: Maybe<Scalars['String']>;
  /** The URL to the privacy policy of the plugin. */
  privacyUrl?: Maybe<Scalars['String']>;
  /** The support email of a plugin. */
  supportEmail?: Maybe<Scalars['String']>;
  /** The email address of the plugin author. */
  email?: Maybe<Scalars['String']>;
  /** The icon of the plugin. */
  icon?: Maybe<Scalars['String']>;
  /** Whether the plugin stores personal data. */
  storesPersonalData?: Maybe<Scalars['Boolean']>;
  /** API Key associated with this plugin. */
  apiKey?: Maybe<Scalars['String']>;
};

/** Price quotes for upgrading from Standard to BC */
export type UpgradePriceQuoteInfo = {
  __typename: 'UpgradePriceQuoteInfo';
  /** The price quote for the prorated amount */
  immediate?: Maybe<PriceQuote>;
  /** The price quote for the new subscription */
  renewal?: Maybe<PriceQuote>;
  /** The dollar amount in account credits available */
  nAccountCreditsTotal?: Maybe<Scalars['Float']>;
  /** The total of the quote, minus any account credits */
  nImmediateTotalLessAccountCredits?: Maybe<Scalars['Float']>;
};
