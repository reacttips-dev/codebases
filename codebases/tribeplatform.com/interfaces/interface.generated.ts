export var AccessGroupEntityType;
(function (AccessGroupEntityType) {
    AccessGroupEntityType["NETWORK"] = "network";
    AccessGroupEntityType["POST"] = "post";
    AccessGroupEntityType["SPACE"] = "space";
})(AccessGroupEntityType || (AccessGroupEntityType = {}));
export var ActionStatus;
(function (ActionStatus) {
    ActionStatus["FAILED"] = "failed";
    ActionStatus["SUCCEEDED"] = "succeeded";
})(ActionStatus || (ActionStatus = {}));
export var AppInstallationStatus;
(function (AppInstallationStatus) {
    AppInstallationStatus["DELETED"] = "DELETED";
    AppInstallationStatus["DISABLED"] = "DISABLED";
    AppInstallationStatus["ENABLED"] = "ENABLED";
})(AppInstallationStatus || (AppInstallationStatus = {}));
export var CollectionListOrderByEnum;
(function (CollectionListOrderByEnum) {
    CollectionListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    CollectionListOrderByEnum["CUSTOM_ORDERING_INDEX"] = "CUSTOM_ORDERING_INDEX";
    CollectionListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(CollectionListOrderByEnum || (CollectionListOrderByEnum = {}));
export var CustomCodePosition;
(function (CustomCodePosition) {
    CustomCodePosition["BODY"] = "BODY";
    CustomCodePosition["HEAD"] = "HEAD";
})(CustomCodePosition || (CustomCodePosition = {}));
export var CustomSsoType;
(function (CustomSsoType) {
    CustomSsoType["OAUTH2"] = "oauth2";
})(CustomSsoType || (CustomSsoType = {}));
export var DefaultSsoType;
(function (DefaultSsoType) {
    DefaultSsoType["FACEBOOK"] = "facebook";
    DefaultSsoType["GOOGLE"] = "google";
    DefaultSsoType["LINKEDIN"] = "linkedin";
})(DefaultSsoType || (DefaultSsoType = {}));
export var Filtername;
(function (Filtername) {
    Filtername["AND"] = "and";
    Filtername["LEAF"] = "leaf";
    Filtername["OR"] = "or";
})(Filtername || (Filtername = {}));
export var FlaggedType;
(function (FlaggedType) {
    FlaggedType["MEMBER"] = "MEMBER";
    FlaggedType["SYSTEM"] = "SYSTEM";
})(FlaggedType || (FlaggedType = {}));
export var HighlightedTagType;
(function (HighlightedTagType) {
    HighlightedTagType["SECTION"] = "SECTION";
    HighlightedTagType["TOPIC"] = "TOPIC";
})(HighlightedTagType || (HighlightedTagType = {}));
export var ImportRequestStage;
(function (ImportRequestStage) {
    ImportRequestStage["ANSWER"] = "ANSWER";
    ImportRequestStage["COMMENT"] = "COMMENT";
    ImportRequestStage["DISCUSSION"] = "DISCUSSION";
    ImportRequestStage["FIX_POST_TYPES"] = "FIX_POST_TYPES";
    ImportRequestStage["MEMBER"] = "MEMBER";
    ImportRequestStage["QUESTION"] = "QUESTION";
    ImportRequestStage["TOPIC"] = "TOPIC";
})(ImportRequestStage || (ImportRequestStage = {}));
export var ImportRequestStatus;
(function (ImportRequestStatus) {
    ImportRequestStatus["DONE"] = "DONE";
    ImportRequestStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(ImportRequestStatus || (ImportRequestStatus = {}));
export var MemberEmailStatus;
(function (MemberEmailStatus) {
    MemberEmailStatus["NOTDELIVERED"] = "notDelivered";
    MemberEmailStatus["SENT"] = "sent";
    MemberEmailStatus["SPAMMED"] = "spammed";
    MemberEmailStatus["VERIFIED"] = "verified";
})(MemberEmailStatus || (MemberEmailStatus = {}));
export var MemberInvitationStatus;
(function (MemberInvitationStatus) {
    MemberInvitationStatus["ACCEPTED"] = "accepted";
    MemberInvitationStatus["DELIVERED"] = "delivered";
    MemberInvitationStatus["NOTDELIVERED"] = "notDelivered";
    MemberInvitationStatus["NOTSENT"] = "notSent";
    MemberInvitationStatus["REJECTED"] = "rejected";
    MemberInvitationStatus["SENT"] = "sent";
    MemberInvitationStatus["SPAMMED"] = "spammed";
})(MemberInvitationStatus || (MemberInvitationStatus = {}));
export var MemberListOrderByEnum;
(function (MemberListOrderByEnum) {
    MemberListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    MemberListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(MemberListOrderByEnum || (MemberListOrderByEnum = {}));
export var MemberStatus;
(function (MemberStatus) {
    MemberStatus["BLOCKED"] = "BLOCKED";
    MemberStatus["DELETED"] = "DELETED";
    MemberStatus["REMOVED"] = "REMOVED";
    MemberStatus["UNVERIFIED"] = "UNVERIFIED";
    MemberStatus["VERIFIED"] = "VERIFIED";
})(MemberStatus || (MemberStatus = {}));
export var MemberStatusInput;
(function (MemberStatusInput) {
    MemberStatusInput["BLOCKED"] = "BLOCKED";
    MemberStatusInput["UNVERIFIED"] = "UNVERIFIED";
    MemberStatusInput["VERIFIED"] = "VERIFIED";
})(MemberStatusInput || (MemberStatusInput = {}));
export var ModerationEntityType;
(function (ModerationEntityType) {
    ModerationEntityType["MEMBER"] = "MEMBER";
    ModerationEntityType["POST"] = "POST";
})(ModerationEntityType || (ModerationEntityType = {}));
export var ModerationStatus;
(function (ModerationStatus) {
    ModerationStatus["ACCEPTED"] = "ACCEPTED";
    ModerationStatus["REJECTED"] = "REJECTED";
    ModerationStatus["REVIEW"] = "REVIEW";
})(ModerationStatus || (ModerationStatus = {}));
export var NavigationItemType;
(function (NavigationItemType) {
    NavigationItemType["PRIMARY_BUTTON"] = "PRIMARY_BUTTON";
    NavigationItemType["PRIMARY_LINK"] = "PRIMARY_LINK";
    NavigationItemType["SECONDARY_BUTTON"] = "SECONDARY_BUTTON";
    NavigationItemType["TEXT_LINK"] = "TEXT_LINK";
})(NavigationItemType || (NavigationItemType = {}));
export var NetworkIndustryType;
(function (NetworkIndustryType) {
    NetworkIndustryType["BLOGGERCOACHCREATOR"] = "BloggerCoachCreator";
    NetworkIndustryType["CONSULTINGANDAGENCY"] = "ConsultingAndAgency";
    NetworkIndustryType["ECOMERCEANDRETAIL"] = "EcomerceAndRetail";
    NetworkIndustryType["ENTERTAINMENTANDEVENTS"] = "EntertainmentAndEvents";
    NetworkIndustryType["FINANCIANSERVICES"] = "FinancianServices";
    NetworkIndustryType["HEALTHCARE"] = "Healthcare";
    NetworkIndustryType["INTERNETANDONLINESERVICE"] = "InternetAndOnlineService";
    NetworkIndustryType["MEDIAANDPUBLISHING"] = "MediaAndPublishing";
    NetworkIndustryType["NONPROFITANDASSOCIATION"] = "NonProfitAndAssociation";
    NetworkIndustryType["ONLINETRAININGANDEDUCATION"] = "OnlineTrainingAndEducation";
    NetworkIndustryType["OTHER"] = "Other";
    NetworkIndustryType["SOFTWAREANDSAAS"] = "SoftwareAndSaas";
})(NetworkIndustryType || (NetworkIndustryType = {}));
export var NetworkLandingPage;
(function (NetworkLandingPage) {
    NetworkLandingPage["EXPLORE"] = "EXPLORE";
    NetworkLandingPage["FEED"] = "FEED";
    NetworkLandingPage["SPACES"] = "SPACES";
})(NetworkLandingPage || (NetworkLandingPage = {}));
export var NetworkMembership;
(function (NetworkMembership) {
    NetworkMembership["INVITEONLY"] = "inviteOnly";
    NetworkMembership["OPEN"] = "open";
})(NetworkMembership || (NetworkMembership = {}));
export var NetworkPrimaryMembersType;
(function (NetworkPrimaryMembersType) {
    NetworkPrimaryMembersType["CUSTOMERS"] = "Customers";
    NetworkPrimaryMembersType["EMPLOYEES"] = "Employees";
    NetworkPrimaryMembersType["MEMBERS"] = "Members";
    NetworkPrimaryMembersType["OTHER"] = "Other";
    NetworkPrimaryMembersType["STUDENTS"] = "Students";
})(NetworkPrimaryMembersType || (NetworkPrimaryMembersType = {}));
export var NetworkStatus;
(function (NetworkStatus) {
    NetworkStatus["ARCHIVED"] = "archived";
    NetworkStatus["PUBLISHED"] = "published";
    NetworkStatus["UNPUBLISHED"] = "unpublished";
})(NetworkStatus || (NetworkStatus = {}));
export var NetworkStatusChangedBy;
(function (NetworkStatusChangedBy) {
    NetworkStatusChangedBy["ADMIN"] = "admin";
    NetworkStatusChangedBy["SUPPORT"] = "support";
    NetworkStatusChangedBy["SYSTEM"] = "system";
})(NetworkStatusChangedBy || (NetworkStatusChangedBy = {}));
export var NetworkStatusReason;
(function (NetworkStatusReason) {
    NetworkStatusReason["MEMBERCAPACITYEXCEEDED"] = "memberCapacityExceeded";
    NetworkStatusReason["NETWORKCREATED"] = "networkCreated";
    NetworkStatusReason["NETWORKLOCKLIFTED"] = "networkLockLifted";
    NetworkStatusReason["SEATSCAPACITYEXCEEDED"] = "seatsCapacityExceeded";
})(NetworkStatusReason || (NetworkStatusReason = {}));
export var NetworkTimeframeType;
(function (NetworkTimeframeType) {
    NetworkTimeframeType["FEWMONTHS"] = "FewMonths";
    NetworkTimeframeType["FEWWEEKS"] = "FewWeeks";
    NetworkTimeframeType["NOTSURE"] = "NotSure";
    NetworkTimeframeType["VERYSOON"] = "VerySoon";
})(NetworkTimeframeType || (NetworkTimeframeType = {}));
export var NetworkVisibility;
(function (NetworkVisibility) {
    NetworkVisibility["PRIVATE"] = "private";
    NetworkVisibility["PUBLIC"] = "public";
})(NetworkVisibility || (NetworkVisibility = {}));
export var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["IN_APP"] = "IN_APP";
})(NotificationChannel || (NotificationChannel = {}));
export var NotificationVerb;
(function (NotificationVerb) {
    NotificationVerb["COMMENT_CREATED"] = "COMMENT_CREATED";
    NotificationVerb["JOIN_REQUEST_STATUS_UPDATED"] = "JOIN_REQUEST_STATUS_UPDATED";
    NotificationVerb["MEMBER_MENTIONED"] = "MEMBER_MENTIONED";
    NotificationVerb["POST_CREATED"] = "POST_CREATED";
    NotificationVerb["REACTION_CREATED"] = "REACTION_CREATED";
    NotificationVerb["REPLY_CREATED"] = "REPLY_CREATED";
    NotificationVerb["SPACE_MEMBER_ADDED"] = "SPACE_MEMBER_ADDED";
})(NotificationVerb || (NotificationVerb = {}));
export var PayloadType;
(function (PayloadType) {
    PayloadType["JOIN_REQUEST_STATUS"] = "JOIN_REQUEST_STATUS";
    PayloadType["MEMBER"] = "MEMBER";
    PayloadType["NETWORK"] = "NETWORK";
    PayloadType["POST"] = "POST";
    PayloadType["REACTION"] = "REACTION";
    PayloadType["SPACE"] = "SPACE";
})(PayloadType || (PayloadType = {}));
export var PermissionContext;
(function (PermissionContext) {
    PermissionContext["MEMBER"] = "MEMBER";
    PermissionContext["NETWORK"] = "NETWORK";
    PermissionContext["POST"] = "POST";
    PermissionContext["SPACE"] = "SPACE";
})(PermissionContext || (PermissionContext = {}));
export var PinnedInto;
(function (PinnedInto) {
    PinnedInto["MEMBER"] = "member";
    PinnedInto["NETWORK"] = "network";
    PinnedInto["POST"] = "post";
    PinnedInto["SPACE"] = "space";
})(PinnedInto || (PinnedInto = {}));
export var PlanName;
(function (PlanName) {
    PlanName["BASIC"] = "basic";
    PlanName["ENTERPRISE"] = "enterprise";
    PlanName["PLUS"] = "plus";
    PlanName["PREMIUM"] = "premium";
})(PlanName || (PlanName = {}));
export var PlanRenewalType;
(function (PlanRenewalType) {
    PlanRenewalType["MONTH"] = "month";
    PlanRenewalType["YEAR"] = "year";
})(PlanRenewalType || (PlanRenewalType = {}));
export var PostFieldsEnum;
(function (PostFieldsEnum) {
    PostFieldsEnum["BOOLEAN1"] = "boolean1";
    PostFieldsEnum["BOOLEAN2"] = "boolean2";
    PostFieldsEnum["BOOLEAN3"] = "boolean3";
    PostFieldsEnum["BOOLEAN4"] = "boolean4";
    PostFieldsEnum["BOOLEAN5"] = "boolean5";
    PostFieldsEnum["DATE1"] = "date1";
    PostFieldsEnum["DATE2"] = "date2";
    PostFieldsEnum["DATE3"] = "date3";
    PostFieldsEnum["DATE4"] = "date4";
    PostFieldsEnum["DATE5"] = "date5";
    PostFieldsEnum["HTML1"] = "html1";
    PostFieldsEnum["HTML2"] = "html2";
    PostFieldsEnum["HTML3"] = "html3";
    PostFieldsEnum["HTML4"] = "html4";
    PostFieldsEnum["HTML5"] = "html5";
    PostFieldsEnum["HTML6"] = "html6";
    PostFieldsEnum["HTML7"] = "html7";
    PostFieldsEnum["HTML8"] = "html8";
    PostFieldsEnum["HTML9"] = "html9";
    PostFieldsEnum["HTML10"] = "html10";
    PostFieldsEnum["IMAGE1"] = "image1";
    PostFieldsEnum["IMAGE2"] = "image2";
    PostFieldsEnum["IMAGE3"] = "image3";
    PostFieldsEnum["IMAGE4"] = "image4";
    PostFieldsEnum["IMAGE5"] = "image5";
    PostFieldsEnum["NUMBER1"] = "number1";
    PostFieldsEnum["NUMBER2"] = "number2";
    PostFieldsEnum["NUMBER3"] = "number3";
    PostFieldsEnum["NUMBER4"] = "number4";
    PostFieldsEnum["NUMBER5"] = "number5";
    PostFieldsEnum["NUMBERARRAY1"] = "numberArray1";
    PostFieldsEnum["NUMBERARRAY2"] = "numberArray2";
    PostFieldsEnum["NUMBERARRAY3"] = "numberArray3";
    PostFieldsEnum["NUMBERARRAY4"] = "numberArray4";
    PostFieldsEnum["NUMBERARRAY5"] = "numberArray5";
    PostFieldsEnum["TEXT1"] = "text1";
    PostFieldsEnum["TEXT2"] = "text2";
    PostFieldsEnum["TEXT3"] = "text3";
    PostFieldsEnum["TEXT4"] = "text4";
    PostFieldsEnum["TEXT5"] = "text5";
    PostFieldsEnum["TEXT6"] = "text6";
    PostFieldsEnum["TEXT7"] = "text7";
    PostFieldsEnum["TEXT8"] = "text8";
    PostFieldsEnum["TEXT9"] = "text9";
    PostFieldsEnum["TEXT10"] = "text10";
    PostFieldsEnum["TEXTARRAY1"] = "textArray1";
    PostFieldsEnum["TEXTARRAY2"] = "textArray2";
    PostFieldsEnum["TEXTARRAY3"] = "textArray3";
    PostFieldsEnum["TEXTARRAY4"] = "textArray4";
    PostFieldsEnum["TEXTARRAY5"] = "textArray5";
})(PostFieldsEnum || (PostFieldsEnum = {}));
export var PostListFilterByEnum;
(function (PostListFilterByEnum) {
    PostListFilterByEnum["BOOLEAN1"] = "boolean1";
    PostListFilterByEnum["BOOLEAN2"] = "boolean2";
    PostListFilterByEnum["BOOLEAN3"] = "boolean3";
    PostListFilterByEnum["BOOLEAN4"] = "boolean4";
    PostListFilterByEnum["BOOLEAN5"] = "boolean5";
    PostListFilterByEnum["CREATEDAT"] = "createdAt";
    PostListFilterByEnum["DATE1"] = "date1";
    PostListFilterByEnum["DATE2"] = "date2";
    PostListFilterByEnum["DATE3"] = "date3";
    PostListFilterByEnum["DATE4"] = "date4";
    PostListFilterByEnum["DATE5"] = "date5";
    PostListFilterByEnum["NUMBER1"] = "number1";
    PostListFilterByEnum["NUMBER2"] = "number2";
    PostListFilterByEnum["NUMBER3"] = "number3";
    PostListFilterByEnum["NUMBER4"] = "number4";
    PostListFilterByEnum["NUMBER5"] = "number5";
    PostListFilterByEnum["UPDATEDAT"] = "updatedAt";
})(PostListFilterByEnum || (PostListFilterByEnum = {}));
export var PostListFilterByOperator;
(function (PostListFilterByOperator) {
    PostListFilterByOperator["EQUALS"] = "equals";
    PostListFilterByOperator["GT"] = "gt";
    PostListFilterByOperator["GTE"] = "gte";
    PostListFilterByOperator["IN"] = "in";
    PostListFilterByOperator["LT"] = "lt";
    PostListFilterByOperator["LTE"] = "lte";
    PostListFilterByOperator["NOT"] = "not";
})(PostListFilterByOperator || (PostListFilterByOperator = {}));
export var PostListOrderByEnum;
(function (PostListOrderByEnum) {
    PostListOrderByEnum["BOOLEAN1"] = "boolean1";
    PostListOrderByEnum["BOOLEAN2"] = "boolean2";
    PostListOrderByEnum["BOOLEAN3"] = "boolean3";
    PostListOrderByEnum["BOOLEAN4"] = "boolean4";
    PostListOrderByEnum["BOOLEAN5"] = "boolean5";
    PostListOrderByEnum["CREATEDAT"] = "createdAt";
    PostListOrderByEnum["DATE1"] = "date1";
    PostListOrderByEnum["DATE2"] = "date2";
    PostListOrderByEnum["DATE3"] = "date3";
    PostListOrderByEnum["DATE4"] = "date4";
    PostListOrderByEnum["DATE5"] = "date5";
    PostListOrderByEnum["NEGATIVEREACTIONSCOUNT"] = "negativeReactionsCount";
    PostListOrderByEnum["NUMBER1"] = "number1";
    PostListOrderByEnum["NUMBER2"] = "number2";
    PostListOrderByEnum["NUMBER3"] = "number3";
    PostListOrderByEnum["NUMBER4"] = "number4";
    PostListOrderByEnum["NUMBER5"] = "number5";
    PostListOrderByEnum["POSITIVEREACTIONSCOUNT"] = "positiveReactionsCount";
    PostListOrderByEnum["REACTIONSCOUNT"] = "reactionsCount";
    PostListOrderByEnum["REPLIESCOUNT"] = "repliesCount";
    PostListOrderByEnum["TEXT1"] = "text1";
    PostListOrderByEnum["TEXT2"] = "text2";
    PostListOrderByEnum["TEXT3"] = "text3";
    PostListOrderByEnum["TEXT4"] = "text4";
    PostListOrderByEnum["TEXT5"] = "text5";
    PostListOrderByEnum["TOTALREPLIESCOUNT"] = "totalRepliesCount";
    PostListOrderByEnum["UPDATEDAT"] = "updatedAt";
})(PostListOrderByEnum || (PostListOrderByEnum = {}));
export var PostMappingTypeEnum;
(function (PostMappingTypeEnum) {
    PostMappingTypeEnum["BOOLEAN"] = "boolean";
    PostMappingTypeEnum["DATE"] = "date";
    PostMappingTypeEnum["HTML"] = "html";
    PostMappingTypeEnum["IMAGE"] = "image";
    PostMappingTypeEnum["NUMBER"] = "number";
    PostMappingTypeEnum["NUMBERARRAY"] = "numberArray";
    PostMappingTypeEnum["TEXT"] = "text";
    PostMappingTypeEnum["TEXTARRAY"] = "textArray";
})(PostMappingTypeEnum || (PostMappingTypeEnum = {}));
export var PostStatus;
(function (PostStatus) {
    PostStatus["ARCHIVED"] = "ARCHIVED";
    PostStatus["BLOCKED"] = "BLOCKED";
    PostStatus["DELETED"] = "DELETED";
    PostStatus["DRAFTED"] = "DRAFTED";
    PostStatus["PUBLISHED"] = "PUBLISHED";
})(PostStatus || (PostStatus = {}));
export var PostTypeContext;
(function (PostTypeContext) {
    PostTypeContext["POST"] = "post";
    PostTypeContext["REPLY"] = "reply";
})(PostTypeContext || (PostTypeContext = {}));
export var PostTypeListOrderByEnum;
(function (PostTypeListOrderByEnum) {
    PostTypeListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    PostTypeListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(PostTypeListOrderByEnum || (PostTypeListOrderByEnum = {}));
export var PrimaryScopes;
(function (PrimaryScopes) {
    PrimaryScopes["ALL_ACCESS"] = "ALL_ACCESS";
    PrimaryScopes["IMPERSONATE_MEMBER"] = "IMPERSONATE_MEMBER";
    PrimaryScopes["UPDATE_NETWORK"] = "UPDATE_NETWORK";
    PrimaryScopes["VIEW_APP"] = "VIEW_APP";
    PrimaryScopes["VIEW_APP_INSTALLATION"] = "VIEW_APP_INSTALLATION";
    PrimaryScopes["VIEW_BILLING_SUBSCRIPTION"] = "VIEW_BILLING_SUBSCRIPTION";
    PrimaryScopes["VIEW_IMPORT_REQUEST"] = "VIEW_IMPORT_REQUEST";
    PrimaryScopes["VIEW_MEMBER"] = "VIEW_MEMBER";
    PrimaryScopes["VIEW_MEMBER_INVITATION"] = "VIEW_MEMBER_INVITATION";
    PrimaryScopes["VIEW_MODERATION"] = "VIEW_MODERATION";
    PrimaryScopes["VIEW_NETWORK"] = "VIEW_NETWORK";
    PrimaryScopes["VIEW_NETWORK_PLAN"] = "VIEW_NETWORK_PLAN";
    PrimaryScopes["VIEW_ORGANIZATION"] = "VIEW_ORGANIZATION";
    PrimaryScopes["VIEW_POST"] = "VIEW_POST";
    PrimaryScopes["VIEW_ROLE"] = "VIEW_ROLE";
    PrimaryScopes["VIEW_SPACE"] = "VIEW_SPACE";
    PrimaryScopes["VIEW_SPACE_COLLECTION"] = "VIEW_SPACE_COLLECTION";
    PrimaryScopes["VIEW_SPACE_JOIN_REQUEST"] = "VIEW_SPACE_JOIN_REQUEST";
    PrimaryScopes["VIEW_SPACE_MEMBERSHIP"] = "VIEW_SPACE_MEMBERSHIP";
    PrimaryScopes["VIEW_SPACE_ROLE"] = "VIEW_SPACE_ROLE";
    PrimaryScopes["VIEW_SSO"] = "VIEW_SSO";
    PrimaryScopes["VIEW_SSO_MEMBERSHIP"] = "VIEW_SSO_MEMBERSHIP";
    PrimaryScopes["VIEW_SYNC_EVENT"] = "VIEW_SYNC_EVENT";
    PrimaryScopes["VIEW_TRACKER"] = "VIEW_TRACKER";
})(PrimaryScopes || (PrimaryScopes = {}));
export var ReactionType;
(function (ReactionType) {
    ReactionType["EMOJI_BASE"] = "EMOJI_BASE";
    ReactionType["LIKE_BASE"] = "LIKE_BASE";
    ReactionType["VOTE_BASE"] = "VOTE_BASE";
})(ReactionType || (ReactionType = {}));
export var ReportableEntityType;
(function (ReportableEntityType) {
    ReportableEntityType["MEMBER"] = "member";
    ReportableEntityType["POST"] = "post";
    ReportableEntityType["SPACE"] = "space";
    ReportableEntityType["TOPIC"] = "topic";
})(ReportableEntityType || (ReportableEntityType = {}));
export var ReportCategory;
(function (ReportCategory) {
    ReportCategory["HARASSMENT"] = "HARASSMENT";
    ReportCategory["MISINFORMATION"] = "MISINFORMATION";
    ReportCategory["NUDITY"] = "NUDITY";
    ReportCategory["SPAM"] = "SPAM";
    ReportCategory["SUICIDE"] = "SUICIDE";
    ReportCategory["TERRORISM"] = "TERRORISM";
    ReportCategory["VIOLENCE"] = "VIOLENCE";
})(ReportCategory || (ReportCategory = {}));
export var ReportDataType;
(function (ReportDataType) {
    ReportDataType["CHARTDATA"] = "chartData";
    ReportDataType["ENTITYREPORT"] = "entityReport";
    ReportDataType["INTVALUE"] = "intValue";
    ReportDataType["STRINGVALUE"] = "stringValue";
})(ReportDataType || (ReportDataType = {}));
export var ReportSlug;
(function (ReportSlug) {
    ReportSlug["ACTIVEMEMBERS"] = "activeMembers";
    ReportSlug["AVERAGEDAILYACTIVEMEMBERS"] = "averageDailyActiveMembers";
    ReportSlug["HIGHLIGHTS"] = "highlights";
    ReportSlug["NEWMEMBERSOVERTIME"] = "newMembersOverTime";
    ReportSlug["NEWPOSTS"] = "newPosts";
    ReportSlug["NEWREACTIONS"] = "newReactions";
    ReportSlug["NEWREPLIES"] = "newReplies";
    ReportSlug["POPULARDAYSOFWEEK"] = "popularDaysOfWeek";
    ReportSlug["POPULARHOURSOFDAY"] = "popularHoursOfDay";
    ReportSlug["POSTSVSREPLIES"] = "postsVSreplies";
    ReportSlug["TOPMEMBERS"] = "topMembers";
    ReportSlug["TOPPOSTS"] = "topPosts";
    ReportSlug["TOPSPACES"] = "topSpaces";
    ReportSlug["TOTALMEMBERS"] = "totalMembers";
    ReportSlug["TOTALVISITORS"] = "totalVisitors";
    ReportSlug["TRENDINGTAGS"] = "trendingTags";
})(ReportSlug || (ReportSlug = {}));
export var ReportTimeFrame;
(function (ReportTimeFrame) {
    ReportTimeFrame["ALLTIME"] = "allTime";
    ReportTimeFrame["LASTCALENDARQUARTER"] = "lastCalendarQuarter";
    ReportTimeFrame["LASTCALENDARYEAR"] = "lastCalendarYear";
    ReportTimeFrame["LASTMONTH"] = "lastMonth";
    ReportTimeFrame["LASTNINETYDAYS"] = "lastNinetyDays";
    ReportTimeFrame["LASTSEVENDAYS"] = "lastSevenDays";
    ReportTimeFrame["LASTTHIRTYDAYS"] = "lastThirtyDays";
    ReportTimeFrame["LASTTWELVEMONTH"] = "lastTwelveMonth";
    ReportTimeFrame["LASTWEEK"] = "lastWeek";
    ReportTimeFrame["TODAY"] = "today";
    ReportTimeFrame["YESTERDAY"] = "yesterday";
})(ReportTimeFrame || (ReportTimeFrame = {}));
export var RoleListOrderByEnum;
(function (RoleListOrderByEnum) {
    RoleListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    RoleListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(RoleListOrderByEnum || (RoleListOrderByEnum = {}));
export var RoleType;
(function (RoleType) {
    RoleType["ADMIN"] = "admin";
    RoleType["GUEST"] = "guest";
    RoleType["MEMBER"] = "member";
    RoleType["MODERATOR"] = "moderator";
})(RoleType || (RoleType = {}));
export var SearchEntityType;
(function (SearchEntityType) {
    SearchEntityType["MEMBER"] = "member";
    SearchEntityType["POST"] = "post";
    SearchEntityType["SPACE"] = "space";
})(SearchEntityType || (SearchEntityType = {}));
export var SlateType;
(function (SlateType) {
    SlateType["PAGE"] = "PAGE";
    SlateType["WIDGET"] = "WIDGET";
})(SlateType || (SlateType = {}));
export var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (SortOrder = {}));
export var SpaceJoinRequestStatus;
(function (SpaceJoinRequestStatus) {
    SpaceJoinRequestStatus["COMPLETED"] = "COMPLETED";
    SpaceJoinRequestStatus["DECLINED"] = "DECLINED";
    SpaceJoinRequestStatus["PENDING"] = "PENDING";
})(SpaceJoinRequestStatus || (SpaceJoinRequestStatus = {}));
export var SpaceListOrderByEnum;
(function (SpaceListOrderByEnum) {
    SpaceListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    SpaceListOrderByEnum["CUSTOM_ORDERING_INDEX"] = "CUSTOM_ORDERING_INDEX";
    SpaceListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(SpaceListOrderByEnum || (SpaceListOrderByEnum = {}));
export var SpaceMemberListOrderByEnum;
(function (SpaceMemberListOrderByEnum) {
    SpaceMemberListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    SpaceMemberListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(SpaceMemberListOrderByEnum || (SpaceMemberListOrderByEnum = {}));
export var SpaceMembershipStatus;
(function (SpaceMembershipStatus) {
    SpaceMembershipStatus["JOINED"] = "joined";
    SpaceMembershipStatus["NOTJOINED"] = "notJoined";
    SpaceMembershipStatus["REQUESTED"] = "requested";
})(SpaceMembershipStatus || (SpaceMembershipStatus = {}));
export var SpaceNotificationPreference;
(function (SpaceNotificationPreference) {
    SpaceNotificationPreference["ALL"] = "ALL";
    SpaceNotificationPreference["NEW_POST"] = "NEW_POST";
    SpaceNotificationPreference["NONE"] = "NONE";
})(SpaceNotificationPreference || (SpaceNotificationPreference = {}));
export var SpaceRoleListOrderByEnum;
(function (SpaceRoleListOrderByEnum) {
    SpaceRoleListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    SpaceRoleListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(SpaceRoleListOrderByEnum || (SpaceRoleListOrderByEnum = {}));
export var SpaceRoleType;
(function (SpaceRoleType) {
    SpaceRoleType["ADMIN"] = "admin";
    SpaceRoleType["MEMBER"] = "member";
})(SpaceRoleType || (SpaceRoleType = {}));
export var SpaceTypeListOrderByEnum;
(function (SpaceTypeListOrderByEnum) {
    SpaceTypeListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    SpaceTypeListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(SpaceTypeListOrderByEnum || (SpaceTypeListOrderByEnum = {}));
export var SsoStatus;
(function (SsoStatus) {
    SsoStatus["DISABLE"] = "disable";
    SsoStatus["ENABLE"] = "enable";
})(SsoStatus || (SsoStatus = {}));
export var SsoType;
(function (SsoType) {
    SsoType["FACEBOOK"] = "facebook";
    SsoType["GOOGLE"] = "google";
    SsoType["LINKEDIN"] = "linkedin";
    SsoType["OAUTH2"] = "oauth2";
})(SsoType || (SsoType = {}));
export var StoreItemStanding;
(function (StoreItemStanding) {
    StoreItemStanding["OFFICIAL"] = "OFFICIAL";
    StoreItemStanding["REGULAR"] = "REGULAR";
    StoreItemStanding["VERIFIED"] = "VERIFIED";
})(StoreItemStanding || (StoreItemStanding = {}));
export var StoreItemStatus;
(function (StoreItemStatus) {
    StoreItemStatus["DELETED"] = "DELETED";
    StoreItemStatus["DRAFT"] = "DRAFT";
    StoreItemStatus["PRIVATE"] = "PRIVATE";
    StoreItemStatus["PUBLIC"] = "PUBLIC";
})(StoreItemStatus || (StoreItemStatus = {}));
export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["FAILED"] = "failed";
    SubscriptionStatus["INCOMPLETE"] = "incomplete";
    SubscriptionStatus["INCOMPLETE_EXPIRED"] = "incomplete_expired";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["UNPAID"] = "unpaid";
})(SubscriptionStatus || (SubscriptionStatus = {}));
export var TagFilterType;
(function (TagFilterType) {
    TagFilterType["BLACKLIST"] = "BLACKLIST";
    TagFilterType["WHITELIST"] = "WHITELIST";
})(TagFilterType || (TagFilterType = {}));
export var TagListOrderByEnum;
(function (TagListOrderByEnum) {
    TagListOrderByEnum["CREATED_AT"] = "CREATED_AT";
    TagListOrderByEnum["UPDATED_AT"] = "UPDATED_AT";
})(TagListOrderByEnum || (TagListOrderByEnum = {}));
export var ThemeStatus;
(function (ThemeStatus) {
    ThemeStatus["DRAFT"] = "draft";
    ThemeStatus["PUBLISHED"] = "published";
})(ThemeStatus || (ThemeStatus = {}));
export var TopNavigationAlignment;
(function (TopNavigationAlignment) {
    TopNavigationAlignment["CENTER"] = "CENTER";
    TopNavigationAlignment["LEFT"] = "LEFT";
    TopNavigationAlignment["RIGHT"] = "RIGHT";
})(TopNavigationAlignment || (TopNavigationAlignment = {}));
export var UnauthorizedReason;
(function (UnauthorizedReason) {
    UnauthorizedReason["ACCESS"] = "ACCESS";
    UnauthorizedReason["PLAN"] = "PLAN";
})(UnauthorizedReason || (UnauthorizedReason = {}));
export var UnsubscribeTokenContext;
(function (UnsubscribeTokenContext) {
    UnsubscribeTokenContext["ALL"] = "ALL";
    UnsubscribeTokenContext["MEMBER"] = "MEMBER";
    UnsubscribeTokenContext["MENTIONS"] = "MENTIONS";
    UnsubscribeTokenContext["POST"] = "POST";
    UnsubscribeTokenContext["REACTIONS"] = "REACTIONS";
    UnsubscribeTokenContext["SPACE"] = "SPACE";
})(UnsubscribeTokenContext || (UnsubscribeTokenContext = {}));
export var VatType;
(function (VatType) {
    VatType["AE_TRN"] = "ae_trn";
    VatType["AU_ABN"] = "au_abn";
    VatType["BR_CNPJ"] = "br_cnpj";
    VatType["BR_CPF"] = "br_cpf";
    VatType["CA_BN"] = "ca_bn";
    VatType["CA_QST"] = "ca_qst";
    VatType["CH_VAT"] = "ch_vat";
    VatType["CL_TIN"] = "cl_tin";
    VatType["ES_CIF"] = "es_cif";
    VatType["EU_VAT"] = "eu_vat";
    VatType["HK_BR"] = "hk_br";
    VatType["ID_NPWP"] = "id_npwp";
    VatType["IN_GST"] = "in_gst";
    VatType["JP_CN"] = "jp_cn";
    VatType["JP_RN"] = "jp_rn";
    VatType["KR_BRN"] = "kr_brn";
    VatType["LI_UID"] = "li_uid";
    VatType["MX_RFC"] = "mx_rfc";
    VatType["MY_FRP"] = "my_frp";
    VatType["MY_ITN"] = "my_itn";
    VatType["MY_SST"] = "my_sst";
    VatType["NO_VAT"] = "no_vat";
    VatType["NZ_GST"] = "nz_gst";
    VatType["RU_INN"] = "ru_inn";
    VatType["RU_KPP"] = "ru_kpp";
    VatType["SA_VAT"] = "sa_vat";
    VatType["SG_GST"] = "sg_gst";
    VatType["SG_UEN"] = "sg_uen";
    VatType["TH_VAT"] = "th_vat";
    VatType["TW_VAT"] = "tw_vat";
    VatType["US_EIN"] = "us_ein";
    VatType["ZA_VAT"] = "za_vat";
})(VatType || (VatType = {}));
export var WidgetContexts;
(function (WidgetContexts) {
    WidgetContexts["MEMBER"] = "MEMBER";
    WidgetContexts["POST"] = "POST";
    WidgetContexts["SPACE"] = "SPACE";
})(WidgetContexts || (WidgetContexts = {}));
export var WidgetPositions;
(function (WidgetPositions) {
    WidgetPositions["PAGE"] = "PAGE";
    WidgetPositions["SIDEBAR"] = "SIDEBAR";
})(WidgetPositions || (WidgetPositions = {}));
//# sourceMappingURL=interface.generated.js.map